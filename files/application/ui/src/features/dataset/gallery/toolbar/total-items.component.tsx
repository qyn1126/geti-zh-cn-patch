// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Divider, Flex, Text } from '@geti-ui/ui';
import { useDatasetMediaWithReviewStatus } from 'hooks/use-dataset-media-with-review-status.hook';

import { t } from '../../../../i18n';

type TotalItemsProps = {
    totalSelectedElements: number;
};

const pluralRules = new Intl.PluralRules('en');

export const TotalItems = ({ totalSelectedElements }: TotalItemsProps) => {
    const { totalCount } = useDatasetMediaWithReviewStatus();

    if (totalCount === 0) {
        return null;
    }

    const hasSelectedElements = totalSelectedElements > 0;

    return (
        <Flex gap={'size-100'}>
            {hasSelectedElements && (
                <>
                    <Text>{t('{{value0}} selected', { value0: totalSelectedElements })}</Text>
                    <Divider orientation={'vertical'} size={'S'} />
                </>
            )}

            <Text>
                {t('{{value0}} media {{value1}}', {
                    value0: totalCount,
                    value1: pluralRules.select(totalCount) === 'one' ? t('item') : t('items'),
                })}
            </Text>
        </Flex>
    );
};
