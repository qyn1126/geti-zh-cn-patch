// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Switch } from '@geti-ui/ui';

import { t } from '../../../../../i18n';

type BooleanParameterFieldProps = {
    value: boolean;
    header: string;
    onChange: (isSelected: boolean) => void;
    isDisabled?: boolean;
};

export const BooleanParameterField = ({ value, header, onChange, isDisabled }: BooleanParameterFieldProps) => {
    return (
        <Switch
            isEmphasized
            isSelected={value}
            aria-label={t('Toggle {{value0}}', { value0: header })}
            onChange={onChange}
            isDisabled={isDisabled}
        >
            {value ? t('On') : t('Off')}
        </Switch>
    );
};
