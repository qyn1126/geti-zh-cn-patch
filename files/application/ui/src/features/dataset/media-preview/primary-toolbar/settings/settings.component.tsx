// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Flex,
    Heading,
    Text,
    Tooltip,
    TooltipTrigger,
} from '@geti-ui/ui';
import { Adjustments, Close } from '@geti-ui/ui/icons';

import { t } from '../../../../../i18n';
import { CanvasSettings } from './canvas-settings.component';

import styles from './settings.module.scss';

export const Settings = () => {
    return (
        <DialogTrigger type={'popover'} hideArrow placement={'top'}>
            <TooltipTrigger>
                <ActionButton isQuiet aria-label={t('Settings')}>
                    <Adjustments />
                </ActionButton>
                <Tooltip>{t('Settings')}</Tooltip>
            </TooltipTrigger>
            {(close) => (
                <Dialog UNSAFE_className={styles.settingsDialog}>
                    <Heading>
                        <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Text>{t('Settings')}</Text>
                            <ActionButton isQuiet onPress={close} aria-label={t('Close settings')}>
                                <Close />
                            </ActionButton>
                        </Flex>
                    </Heading>
                    <Divider size={'S'} />
                    <Content>
                        <CanvasSettings />
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
