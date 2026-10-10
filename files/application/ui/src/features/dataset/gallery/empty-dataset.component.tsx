// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import { Button, Flex, Heading } from '@geti-ui/ui';
import { ENTIRE_DATASET_VIEW_ID, useDatasetViewId } from 'hooks/use-dataset-view-id.hook';

import { ReactComponent as EmptyDatasetImage } from '../../../assets/empty-dataset.svg';
import { t } from '../../../i18n';
import { useImportDatasetDialogState } from '../providers/export-import-dataset-dialog-provider.component';
import { ENTIRE_DATASET_NAME } from './toolbar/dataset-view-selector/util';
import { MediaUpload } from './toolbar/media-upload.component';

const ImportDatasetButton = () => {
    const { datasetImportDialogState } = useImportDatasetDialogState();

    return (
        <Button variant={'secondary'} onPress={() => datasetImportDialogState.open()}>
            {t('Import dataset')}
        </Button>
    );
};

const EmptyMessage = ({ children }: { children: ReactNode }) => {
    return (
        <Heading level={2} UNSAFE_style={{ textAlign: 'center' }}>
            {children}
        </Heading>
    );
};

const NoMatchingMediaItems = () => {
    return (
        <EmptyMessage>
            {t('No media items match your filter.')}
            <br />
            {t('Remove or select a new filter.')}
        </EmptyMessage>
    );
};

const EmptyDatasetView = () => {
    const [, setDatasetViewId] = useDatasetViewId();

    return (
        <>
            <EmptyMessage>
                {t('This view has no media items.')}
                <br />
                {t('Assign media items to it, or go back to the entire dataset.')}
            </EmptyMessage>
            <Button variant={'secondary'} onPress={() => setDatasetViewId(ENTIRE_DATASET_VIEW_ID)}>
                {t('Go to {{value0}}', { value0: ENTIRE_DATASET_NAME })}
            </Button>
        </>
    );
};

const EmptyEntireDataset = () => {
    return (
        <>
            <EmptyMessage>
                {t('Your dataset is empty.')}
                <br />
                {t('Upload your first media item to get started.')}
            </EmptyMessage>
            <Flex gap={'size-100'}>
                <MediaUpload testId={'upload-media-input-empty-dataset'} />
                <ImportDatasetButton />
            </Flex>
        </>
    );
};

type EmptyDatasetProps = {
    hasActiveFilter: boolean;
};

const EmptyDatasetContent = ({ hasActiveFilter }: EmptyDatasetProps) => {
    const [datasetViewId] = useDatasetViewId();

    if (hasActiveFilter) {
        return <NoMatchingMediaItems />;
    }

    if (datasetViewId !== ENTIRE_DATASET_VIEW_ID) {
        return <EmptyDatasetView />;
    }

    return <EmptyEntireDataset />;
};

export const EmptyDataset = ({ hasActiveFilter }: EmptyDatasetProps) => {
    return (
        <Flex direction={'column'} gap={'size-200'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
            <EmptyDatasetImage />
            <EmptyDatasetContent hasActiveFilter={hasActiveFilter} />
        </Flex>
    );
};
