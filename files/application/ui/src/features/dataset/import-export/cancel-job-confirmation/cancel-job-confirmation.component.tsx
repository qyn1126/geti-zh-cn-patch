// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { $api } from '@/api';
import { AlertDialog, Button, DialogTrigger } from '@geti-ui/ui';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { isInvalidJob } from 'hooks/api/util';

import { t } from '../../../../i18n';

type CancelJobConfirmationProps = {
    jobId: string;
    onRemove: () => void | Promise<void>;
};

export const CancelJobConfirmation = ({ jobId, onRemove }: CancelJobConfirmationProps) => {
    const dialogState = useOverlayTriggerState({});
    const cancelMutation = $api.useMutation('post', `/api/jobs/{job_id}:cancel`);

    const handleCancel = () => {
        cancelMutation.mutate(
            { params: { path: { job_id: jobId } } },
            {
                onSuccess: async () => await onRemove(),
                onError: async (error) => {
                    isInvalidJob(error) && (await onRemove());
                },
                onSettled: () => {
                    dialogState.close();
                },
            }
        );
    };

    return (
        <DialogTrigger>
            <Button
                variant='negative'
                style='outline'
                aria-label={t('cancel job dialog')}
                isDisabled={cancelMutation.isPending}
                isPending={cancelMutation.isPending}
            >
                {t('Cancel')}
            </Button>
            <AlertDialog
                title={t('Cancel Job')}
                variant='destructive'
                cancelLabel='Cancel'
                autoFocusButton='primary'
                primaryActionLabel={t('Cancel Job')}
                onPrimaryAction={handleCancel}
                onSecondaryAction={dialogState.close}
                isPrimaryActionDisabled={cancelMutation.isPending}
            >
                {t('Are you sure you want to cancel the job "{{value0}}"?', { value0: jobId })}
            </AlertDialog>
        </DialogTrigger>
    );
};
