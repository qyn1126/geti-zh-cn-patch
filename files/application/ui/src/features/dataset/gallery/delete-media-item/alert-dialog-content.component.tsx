// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { AlertDialog, Text } from '@geti-ui/ui';

import { t } from '../../../../i18n';
import { pluralizeItems } from '../../../../shared/util';

type AlertDialogContentProps = {
    itemsIds: string[];
    onPrimaryAction: () => void;
};

export const AlertDialogContent = ({ itemsIds, onPrimaryAction }: AlertDialogContentProps) => {
    return (
        <AlertDialog
            maxHeight={'size-6000'}
            title={t('Delete Items')}
            variant='destructive'
            primaryActionLabel={t('Confirm')}
            secondaryActionLabel={t('Cancel')}
            onPrimaryAction={onPrimaryAction}
            autoFocusButton='primary'
        >
            <Text>
                {t('Are you sure you want to delete {{value0}} {{value1}}?', {
                    value0: itemsIds.length,
                    value1: pluralizeItems(itemsIds.length),
                })}
            </Text>
        </AlertDialog>
    );
};
