// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, Text } from '@geti-ui/ui';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as EmptyFolderImage } from '../../../../assets/empty-folder.svg';
import { paths } from '../../../../constants/paths';
import { i18n, t } from '../../../../i18n';
import { useImportDatasetDialog } from '../../providers/import-dataset-dialog-provider.component';
import { ImportDatasetAsNewProject } from '../import-dataset-as-new-project/import-dataset-as-new-project.component';
import { WorkflowSteps } from './workflow-steps.component';

import classes from './empty-project-list.module.scss';

export const EmptyProjectList = () => {
    const navigate = useNavigate();
    const { datasetImportDialogState, setCurrentStep, setCurrentStagedId } = useImportDatasetDialog();

    const handleCreateProject = () => {
        navigate(paths.project.new.pattern, {
            viewTransition: true,
        });
    };

    const handleCreateFromDataset = () => {
        setCurrentStep('uploading');
        setCurrentStagedId(null);
        datasetImportDialogState.open();
    };

    return (
        <div className={classes.emptyState}>
            <p className={classes.intro}>
                <Trans
                    i18n={i18n}
                    i18nKey={
                        'Welcome to <name>Geti</name>, a vision AI platform that guides you through the ' +
                        '<lifecycle>complete model lifecycle</lifecycle>, from dataset preparation to training, ' +
                        'optimization and deployment.'
                    }
                    components={{
                        name: <span className={classes.introName} />,
                        lifecycle: <span className={classes.introHighlight} />,
                    }}
                />
            </p>

            <Flex
                gap={'size-100'}
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                UNSAFE_className={classes.container}
            >
                <EmptyFolderImage aria-label={t('empty list')} />

                <Flex alignItems={'center'} gap={'size-100'}>
                    <Button variant='accent' id='create-new-project-button' onPress={handleCreateProject}>
                        <Text UNSAFE_style={{ whiteSpace: 'nowrap' }}>{t('Create new Project')}</Text>
                    </Button>
                    <Button variant='accent' id='create-from-dataset-button' onPress={handleCreateFromDataset}>
                        <Text UNSAFE_style={{ whiteSpace: 'nowrap' }}>{t('Create from dataset')}</Text>
                    </Button>
                </Flex>

                <ImportDatasetAsNewProject dialogState={datasetImportDialogState} />
            </Flex>

            <WorkflowSteps />
        </div>
    );
};
