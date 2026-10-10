// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { t } from '../../../../i18n';
import { Polygon } from '../../../../shared/types';

export interface EditPointsProps {
    zoom: number;
    shape: Polygon;
    onComplete: () => void;
    removePoints: (indexes: number[]) => void;
    addPoint: (idx: number, x: number, y: number) => void;
    moveAnchorTo: (idx: number, x: number, y: number) => void;
}

export const selectAnchorPointLabel = (idx: number, isSelected: boolean, selectedAnchorIndexes: number[]): string => {
    if (isSelected) {
        return t('Click to unselect, or press delete to remove point {{value0}}', { value0: idx });
    }
    return selectedAnchorIndexes.length > 0
        ? t('Shift click to select point {{value0}}', { value0: idx })
        : t('Click to select point {{value0}}', { value0: idx });
};
