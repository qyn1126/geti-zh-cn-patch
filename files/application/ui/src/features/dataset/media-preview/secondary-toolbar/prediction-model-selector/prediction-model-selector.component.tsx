// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Item, Picker } from '@geti-ui/ui';
import { isEmpty } from 'lodash-es';

import { t } from '../../../../../i18n';
import { usePredictionSetup } from '../../../../annotator/predictions-setup-provider.component';

type PredictionModelSelectorProps = {
    isDisabled: boolean;
};

export const PredictionModelSelector = ({ isDisabled }: PredictionModelSelectorProps) => {
    const { selectableModels, selectedModelId, changeSelectedModelId } = usePredictionSetup();

    if (isEmpty(selectableModels)) {
        return null;
    }

    return (
        <Picker
            aria-label={t('Select prediction model')}
            label={t('Model')}
            width={'100%'}
            items={selectableModels}
            selectedKey={selectedModelId}
            isDisabled={isDisabled}
            onSelectionChange={(key) => key !== null && changeSelectedModelId(String(key))}
        >
            {(item) => <Item key={item.modelVariantId}>{item.name}</Item>}
        </Picker>
    );
};
