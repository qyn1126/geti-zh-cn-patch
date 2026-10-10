// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import type { SinkOutputFormats } from '@/api/types';
import { Checkbox, CheckboxGroup } from '@geti-ui/ui';

import { t } from '../../../../i18n';
import { OutputFormat } from '../utils';

import classes from './output-formats.module.scss';

type OutputFormatsProps = {
    config?: SinkOutputFormats;
};

export const OutputFormats = ({ config = [] }: OutputFormatsProps) => {
    return (
        <CheckboxGroup
            isRequired
            label={t('Output Formats')}
            name='output_formats'
            defaultValue={config}
            UNSAFE_className={classes.itemList}
        >
            <Checkbox name='output_formats' value={OutputFormat.PREDICTIONS}>
                {t('Predictions')}
            </Checkbox>
            <Checkbox name='output_formats' value={OutputFormat.IMAGE_ORIGINAL}>
                {t('Image Original')}
            </Checkbox>
            <Checkbox name='output_formats' value={OutputFormat.IMAGE_WITH_PREDICTIONS}>
                {t('Image with Predictions')}
            </Checkbox>
        </CheckboxGroup>
    );
};
