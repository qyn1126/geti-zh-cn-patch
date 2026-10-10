// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Badge, Text } from '@geti-ui/ui';
import { clsx } from 'clsx';

import { t } from '../../../../i18n';

import classes from './active-project-badge.module.scss';

type ActiveProjectBadgeProps = {
    size?: 'S' | 'M';
};

export const ActiveProjectBadge = ({ size = 'M' }: ActiveProjectBadgeProps) => {
    return (
        <Badge variant={'neutral'} UNSAFE_className={clsx(classes.activeTag, { [classes.small]: size === 'S' })}>
            <Text>{t('Active')}</Text>
        </Badge>
    );
};
