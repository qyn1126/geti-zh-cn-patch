// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Flex, Heading, Text } from '@geti-ui/ui';

import { ReactComponent as EmptyFolderImage } from '../../../../assets/empty-folder.svg';
import { t } from '../../../../i18n';

import classes from './no-matching-projects.module.scss';

export const NoMatchingProjects = () => {
    return (
        <Flex
            gap={'size-100'}
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            UNSAFE_className={classes.container}
        >
            <EmptyFolderImage aria-label={t('no matching projects')} />

            <Heading level={3} margin={0}>
                {t('No projects match your filters')}
            </Heading>

            <Text UNSAFE_style={{ textAlign: 'center' }}>
                {t('Try adjusting your search or task type filters to find what you ' + 'are looking for.')}
            </Text>
        </Flex>
    );
};
