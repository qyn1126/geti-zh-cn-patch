// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { Button, ButtonGroup, Content, Dialog, Divider, Form, Heading, TextField } from '@geti-ui/ui';

import { t } from '../../../../../i18n';

interface RenameModelDialogProps {
    currentName: string;
    onRename: (newName: string) => void;
    onClose: () => void;
    isPending?: boolean;
}

export const RenameModelDialog = ({ currentName, onRename, onClose, isPending }: RenameModelDialogProps) => {
    const [newName, setNewName] = useState(currentName);

    const hasSameName = newName.trim() === currentName;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onRename(newName.trim());
    };

    return (
        <Dialog>
            <Heading>{t('Rename model')}</Heading>

            <Divider />

            <Content>
                <Form onSubmit={handleSubmit} validationBehavior={'native'}>
                    <TextField label={t('Model name')} value={newName} onChange={setNewName} width='100%' isRequired />
                    <ButtonGroup align={'end'} marginTop={'size-300'}>
                        <Button variant='secondary' onPress={onClose}>
                            {t('Cancel')}
                        </Button>
                        <Button variant='accent' type='submit' isPending={isPending} isDisabled={hasSameName}>
                            {t('Rename')}
                        </Button>
                    </ButtonGroup>
                </Form>
            </Content>
        </Dialog>
    );
};
