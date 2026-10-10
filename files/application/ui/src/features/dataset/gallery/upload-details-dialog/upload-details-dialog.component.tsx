// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import {
    ActionButton,
    Button,
    ButtonGroup,
    Cell,
    Column,
    Content,
    Dialog,
    DialogContainer,
    DialogTrigger,
    Divider,
    Flex,
    Heading,
    Loading,
    Row,
    TableBody,
    TableHeader,
    TableView,
    Text,
    Tooltip,
    TooltipTrigger,
} from '@geti-ui/ui';
import { AcceptCircle, CrossCircle, Pending } from '@geti-ui/ui/icons';

import { t } from '../../../../i18n';
import { formatBytes, pluralizeItems } from '../../../../shared/util';
import { useMediaUploadContext } from '../../providers/media-upload-provider.component';
import { computeSummary, type UploadFileItem, type UploadItemStatus } from '../../providers/media-upload-reducer';

import classes from './upload-details-dialog.module.scss';

const STATUS_LABEL: Record<UploadItemStatus, string> = {
    queued: t('Queued'),
    uploading: t('Uploading'),
    uploaded: t('Uploaded'),
    failed: t('Failed'),
};

const StatusIcon = ({ status }: { status: UploadItemStatus }): ReactNode => {
    switch (status) {
        case 'queued':
            return <Pending aria-label={t('Queued')} size={'S'} />;
        case 'uploading':
            return <Loading mode={'inline'} size={'S'} />;
        case 'uploaded':
            return (
                <AcceptCircle aria-label={t('Uploaded')} width={16} height={16} style={{ fill: 'var(--brand-moss)' }} />
            );
        case 'failed':
            return (
                <CrossCircle
                    aria-label={t('Failed')}
                    width={16}
                    height={16}
                    style={{ fill: 'var(--brand-coral-cobalt)' }}
                />
            );
    }
};

const StatusCell = ({ item }: { item: UploadFileItem }) => {
    const statusContent = (
        <Flex alignItems={'center'} gap={'size-100'}>
            <StatusIcon status={item.status} />
            <Text>{STATUS_LABEL[item.status]}</Text>
        </Flex>
    );

    if (item.status === 'failed' && item.errorMessage) {
        return (
            <Flex alignItems={'center'} gap={'size-100'}>
                {statusContent}
                <DialogTrigger type={'popover'}>
                    <ActionButton isQuiet aria-label={t('Error details')} UNSAFE_className={classes.error}>
                        Error
                    </ActionButton>
                    <Dialog>
                        <Heading>{t('Upload error')}</Heading>
                        <Divider />
                        <Content>
                            <Text>{item.errorMessage}</Text>
                        </Content>
                    </Dialog>
                </DialogTrigger>
            </Flex>
        );
    }

    return statusContent;
};

const buildSubheader = (total: number, succeeded: number, failed: number, isUploading: boolean): string => {
    if (isUploading) {
        const parts = [
            t('{{value0}} uploaded', { value0: succeeded }),
            failed > 0 ? t('{{value0}} failed', { value0: failed }) : null,
        ]
            .filter(Boolean)
            .join(', ');

        return t('Uploading {{value0}} {{value1}} — {{value2}}', {
            value0: total,
            value1: pluralizeItems(total),
            value2: parts,
        });
    }

    if (failed === 0)
        return t('Uploaded {{value0}} {{value1}}', { value0: succeeded, value1: pluralizeItems(succeeded) });
    if (succeeded === 0)
        return t('Failed to upload {{value0}} {{value1}}', { value0: failed, value1: pluralizeItems(failed) });

    return t('Uploaded {{value0}} {{value1}}, {{value2}} failed', {
        value0: succeeded,
        value1: pluralizeItems(succeeded),
        value2: failed,
    });
};

const UploadDetailsDialogContent = ({ onClose }: { onClose: () => void }) => {
    const { state } = useMediaUploadContext();
    const summary = computeSummary(state.items, state.isUploading);
    const items = state.items;

    const subheader = buildSubheader(summary.total, summary.succeeded, summary.failed, summary.isUploading);

    return (
        <Dialog size={'L'}>
            <Heading>{t('Upload details')}</Heading>
            <Divider />
            <Content>
                <Flex direction={'column'} gap={'size-200'}>
                    <Text>{subheader}</Text>
                    <TableView
                        aria-label={t('Upload details')}
                        overflowMode={'truncate'}
                        density={'compact'}
                        maxHeight={'60vh'}
                        isQuiet
                    >
                        <TableHeader>
                            <Column isRowHeader>{t('FILENAME')}</Column>
                            <Column width={160}>{t('STATUS')}</Column>
                            <Column width={120} align={'end'}>
                                {t('SIZE')}
                            </Column>
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <Row key={item.id}>
                                    <Cell>
                                        <TooltipTrigger>
                                            <Text>{item.name}</Text>
                                            <Tooltip>{item.name}</Tooltip>
                                        </TooltipTrigger>
                                    </Cell>
                                    <Cell>
                                        <StatusCell item={item} />
                                    </Cell>
                                    <Cell>{formatBytes(item.size)}</Cell>
                                </Row>
                            )}
                        </TableBody>
                    </TableView>
                </Flex>
            </Content>
            <ButtonGroup>
                <Button variant={'primary'} onPress={onClose}>
                    {t('Close')}
                </Button>
            </ButtonGroup>
        </Dialog>
    );
};

export const UploadDetailsDialog = () => {
    const { state, dispatch } = useMediaUploadContext();
    const close = () => dispatch({ type: 'CLOSE_DIALOG' });

    return (
        <DialogContainer onDismiss={close}>
            {state.isDetailsDialogOpen && <UploadDetailsDialogContent onClose={close} />}
        </DialogContainer>
    );
};
