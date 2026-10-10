// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import type { Project } from '@/api/types';
import { orderBy } from 'lodash-es';

import { t } from '../../../../i18n';

export const SORT_BY_OPTIONS = [
    [
        { name: t('Name (A-Z)'), key: 'name-ascending' },
        { name: t('Name (Z-A)'), key: 'name-descending' },
    ],
    [
        { name: t('Created date (newest)'), key: 'createdAt-descending' },
        { name: t('Created date (oldest)'), key: 'createdAt-ascending' },
    ],
] as const;

export type SortBy = (typeof SORT_BY_OPTIONS)[number][number]['key'];

export const SORT_BY_HANDLERS: Record<SortBy, (projects: Project[]) => Project[]> = {
    'name-ascending': (projects) => orderBy(projects, (project) => project.name.toLocaleLowerCase(), 'asc'),
    'name-descending': (projects) => orderBy(projects, (project) => project.name.toLocaleLowerCase(), 'desc'),
    'createdAt-ascending': (projects) => orderBy(projects, (project) => project.created_at, 'asc'),
    'createdAt-descending': (projects) => orderBy(projects, (project) => project.created_at, 'desc'),
};
