// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { AlertDialog, DialogContainer } from '@geti-ui/ui';

import { t } from '../../i18n';

type EnablePipelineBlockedDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const EnablePipelineBlockedDialog = ({ isOpen, onClose }: EnablePipelineBlockedDialogProps) => {
    return (
        <DialogContainer onDismiss={onClose}>
            {isOpen && (
                <AlertDialog
                    title={t('Cannot enable pipeline')}
                    primaryActionLabel={t('Close')}
                    variant={'warning'}
                    onPrimaryAction={onClose}
                >
                    {t('Make sure you selected a model and source before enabling the ' + 'pipeline.')}
                </AlertDialog>
            )}
        </DialogContainer>
    );
};
