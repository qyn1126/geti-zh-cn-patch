// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Slider } from '@geti-ui/ui';

import { t } from '../../../../../i18n';
import { HeaderSetting, HeaderSettingProps } from './header-setting.component';

export const ImageSetting = ({
    headerText,
    value,
    handleValueChange,
    defaultValue,
    formatOptions,
}: HeaderSettingProps) => {
    return (
        <div aria-label={headerText}>
            <HeaderSetting
                headerText={headerText}
                value={value}
                defaultValue={defaultValue}
                formatOptions={formatOptions}
                handleValueChange={handleValueChange}
            />
            <Slider
                width={'100%'}
                step={1}
                value={value}
                minValue={-100}
                maxValue={100}
                onChange={handleValueChange}
                aria-label={t('{{value0}} setting', { value0: headerText })}
                fillOffset={0}
                isFilled
            />
        </div>
    );
};
