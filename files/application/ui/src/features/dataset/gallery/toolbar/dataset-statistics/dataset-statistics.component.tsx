// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from 'react';

import {
    ActionButton,
    Button,
    ButtonGroup,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Heading,
    Loading,
    Tooltip,
    TooltipTrigger,
} from '@geti-ui/ui';
import { GraphChart } from '@geti-ui/ui/icons';

import { t } from '../../../../../i18n';
import { DatasetStatisticsContent } from './dataset-statistics-content.component';

export const DatasetStatistics = () => {
    return (
        <DialogTrigger isDismissable>
            <TooltipTrigger>
                <ActionButton isQuiet aria-label={t('dataset statistics')}>
                    <GraphChart />
                </ActionButton>
                <Tooltip>{t('Dataset statistics')}</Tooltip>
            </TooltipTrigger>
            {(close) => (
                <Dialog width={{ base: '90vw', L: '70vw' }}>
                    <Heading>{t('Dataset Statistics')}</Heading>
                    <Divider />
                    <Content>
                        <Suspense fallback={<Loading size='M' />}>
                            <DatasetStatisticsContent />
                        </Suspense>
                    </Content>
                    <ButtonGroup>
                        <Button variant='secondary' onPress={close}>
                            {t('Close')}
                        </Button>
                    </ButtonGroup>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
