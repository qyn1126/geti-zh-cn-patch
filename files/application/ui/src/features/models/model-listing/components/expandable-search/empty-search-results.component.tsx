// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Flex, Heading } from '@geti-ui/ui';
import { Search } from '@geti-ui/ui/icons';

import { t } from '../../../../../i18n';

export const EmptySearchResults = () => {
    return (
        <Flex direction={'column'} alignItems={'center'} justifyContent={'center'} gap={'size-200'} height={'100%'}>
            <Search />
            <Heading level={3}>{t('No models found')}</Heading>
        </Flex>
    );
};
