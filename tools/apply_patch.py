#!/usr/bin/env python3
"""Validate and apply/reverse the Geti localization patch. Python >= 3.10; Git required."""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path


PACKAGE = Path(__file__).resolve().parents[1]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def run_git(root, *args):
    result = subprocess.run(['git', '-C', str(root), *args], capture_output=True, text=True, encoding='utf-8')
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or 'Git command failed')
    return result.stdout.strip()


def inside(root, relative):
    path = Path(relative)
    if path.is_absolute() or '..' in path.parts:
        raise RuntimeError(f'Unsafe relative path: {relative}')
    resolved = (root / path).resolve()
    if not resolved.is_relative_to(root):
        raise RuntimeError(f'Path leaves the expected directory: {relative}')
    return resolved


def content_hash(path):
    if not path.exists():
        return None
    if not path.is_file():
        raise RuntimeError(f'Expected a regular file: {path}')
    # Git checkouts on Windows may use CRLF; the exported source blobs use LF.
    return sha256(path.read_bytes().replace(b'\r\n', b'\n'))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('geti_dir', type=Path, help='Root directory of the matching Geti Git checkout')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--check', action='store_true', help='Validate only (the default)')
    mode.add_argument('--apply', action='store_true', help='Apply after all checks pass')
    parser.add_argument('--reverse', action='store_true', help='Validate or apply the reverse patch')
    args = parser.parse_args()

    manifest = json.loads((PACKAGE / 'manifest.json').read_text(encoding='utf-8'))
    if manifest.get('format_version') != 1:
        raise RuntimeError('Unsupported manifest format.')
    patch = inside(PACKAGE, manifest['patch'])
    if sha256(patch.read_bytes()) != manifest['patch_sha256']:
        raise RuntimeError('Patch integrity check failed.')
    paths = set()
    for entry in manifest['files']:
        name = entry['path']
        if not name.startswith('application/ui/') or name in paths:
            raise RuntimeError(f'Unexpected or duplicate manifest path: {name}')
        paths.add(name)
        source = inside(PACKAGE / 'files', name)
        if content_hash(source) != entry['sha256']:
            raise RuntimeError(f'Exported file integrity check failed: {name}')

    root = args.geti_dir.resolve(strict=True)
    actual_root = Path(run_git(root, 'rev-parse', '--show-toplevel')).resolve()
    if not root.samefile(actual_root):
        raise RuntimeError('Pass the Geti repository root, not a subdirectory.')
    if run_git(root, 'rev-parse', 'HEAD') != manifest['base_commit']:
        raise RuntimeError(f'Expected Geti base commit {manifest["base_commit"]}. See USAGE.md.')

    current = {entry['path']: content_hash(inside(root, entry['path'])) for entry in manifest['files']}
    before_key = 'sha256' if args.reverse else 'base_sha256'
    after_key = 'base_sha256' if args.reverse else 'sha256'
    if all(current[entry['path']] == entry[after_key] for entry in manifest['files']):
        print('Patch already reversed.' if args.reverse else 'Patch already applied.')
        return
    conflicts = [entry['path'] for entry in manifest['files'] if current[entry['path']] != entry[before_key]]
    if conflicts:
        raise RuntimeError('Target files differ from the expected state; nothing was changed:\n' + '\n'.join(conflicts))

    direction = ['--reverse'] if args.reverse else []
    run_git(root, 'apply', *direction, '--check', '--whitespace=nowarn', str(patch))
    if not args.apply:
        print(f'Validation passed for {len(paths)} files. Use --apply to write the changes.')
        return

    run_git(root, 'apply', *direction, '--whitespace=nowarn', str(patch))
    mismatches = [entry['path'] for entry in manifest['files']
                  if content_hash(inside(root, entry['path'])) != entry[after_key]]
    if mismatches:
        raise RuntimeError('Post-application verification failed:\n' + '\n'.join(mismatches))
    print(f'Patch {"reversed" if args.reverse else "applied"}; verified {len(paths)} files. Rebuild the frontend next.')


if __name__ == '__main__':
    try:
        main()
    except (OSError, RuntimeError, ValueError, KeyError) as error:
        print(f'ERROR: {error}', file=sys.stderr)
        sys.exit(1)
