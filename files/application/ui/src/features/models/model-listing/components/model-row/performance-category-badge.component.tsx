// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Text } from '@geti-ui/ui';
import { capitalize } from 'lodash-es';

import { ReactComponent as ThumbsUp } from '../../../../../assets/icons/thumbs-up.svg';
import { t } from '../../../../../i18n';
import { ModelBadge } from './model-badge.component';

type PerformanceCategoryBadgeProps = {
    performanceCategory: string;
    id?: string;
    color?: string;
};

export const PerformanceCategoryBadge = ({ performanceCategory, id, color }: PerformanceCategoryBadgeProps) => {
    return (
        <ModelBadge id={id} color={color}>
            <ThumbsUp />
            <Text>{t(capitalize(performanceCategory))}</Text>
        </ModelBadge>
    );
};
