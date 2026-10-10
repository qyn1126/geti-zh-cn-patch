// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { t } from '../../i18n';

export const validateProjectName = (name: string, projectNames: string[]): string | undefined => {
    if (name.trim().length === 0) {
        return t('Project name cannot be empty');
    }

    if (projectNames.includes(name)) {
        return t('That project name already exists');
    }

    return undefined;
};

export const PROJECT_NAME_MAX_LENGTH = 100;
