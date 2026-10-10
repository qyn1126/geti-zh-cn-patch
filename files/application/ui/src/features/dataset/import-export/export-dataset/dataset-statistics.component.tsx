// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { DatasetStatistics } from '../../../../components/dataset-statistics/dataset-statistics.component';
import { useGetDatasetItems } from '../../../../hooks/use-get-dataset-items.hook';
import { t } from '../../../../i18n';

export const MainDatasetStatistics = () => {
    const { totalCount: totalMediaItems } = useGetDatasetItems();
    const { totalCount: totalAnnotatedItems } = useGetDatasetItems({ annotationStatus: 'with_annotations' });

    return (
        <DatasetStatistics
            label={t('items')}
            totalMediaItems={totalMediaItems}
            totalAnnotatedItems={totalAnnotatedItems}
        />
    );
};
