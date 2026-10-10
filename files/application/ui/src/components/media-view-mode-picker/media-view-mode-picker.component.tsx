// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ActionButton, Item, MediaViewModesProps, Menu, MenuTrigger, ViewModes } from '@geti-ui/ui';
import { Grid, GridMedium, GridSmall } from '@geti-ui/ui/icons';

import { t } from '../../i18n';

// The library's MediaViewModes does not expose its hard-coded English labels.
export const MediaViewModePicker = ({
    items = [ViewModes.LARGE, ViewModes.MEDIUM, ViewModes.SMALL],
    viewMode,
    setViewMode,
    isDisabled,
}: MediaViewModesProps) => {
    const Icon = viewMode === ViewModes.SMALL ? GridSmall : viewMode === ViewModes.MEDIUM ? GridMedium : Grid;

    return (
        <MenuTrigger>
            <ActionButton isQuiet isDisabled={isDisabled} aria-label={t('View mode')}>
                <Icon />
            </ActionButton>
            <Menu
                aria-label={t('View mode')}
                selectionMode='single'
                selectedKeys={[viewMode]}
                onAction={(key) => {
                    const mode = items.find((item) => item === key);
                    if (mode !== undefined && mode !== viewMode) setViewMode(mode);
                }}
            >
                {items.map((mode) => (
                    <Item key={mode} textValue={t(mode)}>
                        {t(mode)}
                    </Item>
                ))}
            </Menu>
        </MenuTrigger>
    );
};
