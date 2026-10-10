// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { AlertDialog, DialogContainer } from '@geti-ui/ui';
import { useDeleteProject } from 'hooks/api/project.hook';

import { t } from '../../i18n';
import { toast } from '../toast/toast.component';

type DeleteProjectDialogProps = {
    isOpen: boolean;
    projectId: string;
    projectName: string;
    onClose: () => void;
    onDeleted?: () => void;
};

export const DeleteProjectDialog = ({
    isOpen,
    projectId,
    projectName,
    onClose,
    onDeleted,
}: DeleteProjectDialogProps) => {
    const deleteMutation = useDeleteProject();

    const handleDelete = () => {
        deleteMutation.mutate(
            { params: { path: { project_id: projectId } } },
            {
                onSuccess: () => {
                    onDeleted?.();
                    toast({ type: 'success', message: t('Project deleted successfully') });
                },
            }
        );
    };

    return (
        <DialogContainer onDismiss={onClose}>
            {isOpen && (
                <AlertDialog
                    title={t('Delete')}
                    variant='destructive'
                    cancelLabel='Cancel'
                    primaryActionLabel={t('Delete')}
                    onPrimaryAction={handleDelete}
                    onSecondaryAction={onClose}
                    autoFocusButton='primary'
                    isPrimaryActionDisabled={deleteMutation.isPending}
                >
                    {t('Are you sure you want to delete project "{{value0}}"?', { value0: projectName })}
                </AlertDialog>
            )}
        </DialogContainer>
    );
};
