# 使用说明

## 1. 确认版本

补丁对应 Geti `app/v3.2.0`，基线提交为：

```text
9456821d060a2143cf05a2e01504acbb9924a578
```

在 Geti 源码目录执行 `git rev-parse HEAD` 查看当前提交。补丁工具会拒绝其他基线版本，并检查涉及的文件是否存在额外修改。如果已安装本补丁，会识别当前状态并提示，无需重复应用。

已有其他版本或自定义修改时，请先另建匹配版本的工作目录，或人工审阅补丁后合并。避免直接把 `files/` 覆盖到正在开发的工作区。

还没有 Geti 源码时，可先获取指定版本：

```sh
git -c core.longpaths=true clone --branch app/v3.2.0 --depth 1 https://github.com/open-edge-platform/geti.git geti
```

本私有仓库需要有访问权限的 GitHub 账号。可使用 GitHub 网页的 **Code → Download ZIP** 下载，或在 Git 已登录后执行：

```sh
git clone https://github.com/qyn1126/geti-zh-cn-patch.git
```

目录组织示例：

```text
workspace/
  geti/
  geti-zh-cn-patch/
```

## 2. 校验并应用

在上述 `workspace/` 中执行，Windows 和 Ubuntu 命令相同；Ubuntu 可将 `python` 替换为 `python3`。

```sh
python geti-zh-cn-patch/tools/apply_patch.py geti --check
python geti-zh-cn-patch/tools/apply_patch.py geti --apply
```

工具会校验补丁及 316 个完整文件的 SHA-256、Geti 基线提交、目标文件原始内容，然后调用 `git apply --check`。全部通过后才应用，修改范围限定在清单中的 `application/ui/` 文件，不执行安装或训练任务。

也可直接使用 Git（自行确认基线和本地改动）：

```sh
git -C geti apply --check ../geti-zh-cn-patch/patches/geti-zh-cn.patch
git -C geti apply ../geti-zh-cn-patch/patches/geti-zh-cn.patch
```

## 3. 构建前端

需要 Node.js **24.2.0 或更高版本**、npm **11.14.0 或更高版本**，版本要求来自上游 `application/ui/package.json`。使用上游 `package-lock.json` 安装依赖。

### Windows PowerShell

```powershell
Set-Location .\geti\application\ui
npm.cmd ci --no-audit --no-fund
$env:ASSET_PREFIX = '/html/'
npm.cmd run build
```

### Ubuntu / Bash

```bash
cd geti/application/ui
npm ci --no-audit --no-fund
ASSET_PREFIX=/html/ npm run build
```

产物位于 `application/ui/dist/`。这里的 `/html/` 对应本机部署时后端静态资源的挂载位置；若使用其他部署方式，请按上游部署配置设置 `ASSET_PREFIX`，并将构建产物放到该服务实际使用的静态目录。

本机已有后端通过 `STATIC_FILES_DIR` 直接读取该 `dist/` 目录时，重新构建并刷新浏览器即可加载新界面。

## 4. 启动服务

本包负责界面补丁。首次安装后端、配置 GPU 或使用容器时，请按对应版本的 [Geti 官方安装说明](https://github.com/open-edge-platform/geti/blob/9456821d060a2143cf05a2e01504acbb9924a578/application/docs/install.md) 完成环境准备。

### 已配置好环境的 Windows 本机部署

`launchers/windows/` 保存了本次本机部署的启停脚本。它们要求：

- 父目录下的 Geti 源码文件夹名为 `geti`。
- 后端 Python 环境位于 `geti/application/backend/.venv/`。
- 前端已构建为 `geti/application/ui/dist/`。
- `7860` 端口可用。

在 `workspace/` 中复制启动器：

```powershell
Copy-Item -Path .\geti-zh-cn-patch\launchers\windows\* -Destination .
.\Start-Geti.cmd
```

随后打开 `https://localhost:7860/projects?lng=zh-CN`。服务仅监听本机 `127.0.0.1`；默认使用 Geti 生成的本机 TLS 证书。

后台进程登记文件与启动日志位于 `geti/.build/runtime/`；应用数据和运行日志分别位于 `geti/application/backend/data/` 与 `geti/application/backend/logs/`。

停止后台服务：

```powershell
.\Stop-Geti.cmd
```

停止脚本会验证登记的进程身份后终止进程树。请在训练、导入或导出完成后使用；正在运行的任务会被中断，已保存数据不会被脚本删除。

需要前台查看日志时，可执行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Start-Geti.ps1 -Foreground
```

Ubuntu 按上游安装说明启动后端；本包中的 `.cmd` / `.ps1` 启停脚本适用于 Windows。

## 5. 语言设置

右上角 **Language / 语言** 提供 **简体中文** 和 **English**。首次打开根据浏览器语言选择，以后使用保存的选择。

语言优先级：URL 参数 `lng` → 浏览器本地存储 `geti-language` → 浏览器语言。

```text
中文：https://localhost:7860/projects?lng=zh-CN
英文：https://localhost:7860/projects?lng=en
```

切换语言会刷新页面，使静态菜单、日期和数字格式同步；切换前保存当前表单。原始训练日志、未知后端诊断消息和用户内容保留原文。

## 6. 检查与回退

补丁应用工具的 `--check` 默认只检查。回退也可先检查：

```sh
python geti-zh-cn-patch/tools/apply_patch.py geti --reverse --check
python geti-zh-cn-patch/tools/apply_patch.py geti --reverse --apply
```

回退要求相关文件仍与本包内容一致；工具发现后续修改时会停止，避免覆盖。回退后重新构建前端并刷新页面。

进行前端类型或测试检查时，先启动后端，并在 `geti/application/ui/` 中生成本地 API 类型：

```sh
npm run update-spec
npm run type-check
npm run lint
npm run format:check
npm run test:unit -- src/i18n --maxWorkers=1
```

浏览器用例位于 `application/ui/tests/localization/localization.spec.ts`，遵循上游 Playwright 测试配置：

```sh
npm exec playwright test tests/localization/localization.spec.ts --project=component
```

Playwright 需要对应浏览器及上游测试环境；测试使用模拟接口，不会真实发起训练。已验证结果和当前限制见 [验证记录](docs/VALIDATION.md)。
