// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ActionButton, Tooltip, TooltipTrigger } from '@geti-ui/ui';
import { Invisible, Visible } from '@geti-ui/ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import { t } from '../../../../i18n';
import { useAnnotationVisibility } from '../../../../shared/annotator/annotation-visibility-provider.component';
import { HOTKEYS } from '../../../../shared/hotkeys-definition';

export const ToggleAnnotationsVisibility = () => {
    const { isVisible, toggleVisibility } = useAnnotationVisibility();

    useHotkeys(HOTKEYS.toggleAnnotationsVisibility, toggleVisibility, [toggleVisibility]);

    return (
        <TooltipTrigger placement={'right'}>
            <ActionButton
                aria-label={t('{{value0}} annotations', { value0: isVisible ? 'Hide' : 'Show' })}
                isQuiet
                onPress={toggleVisibility}
            >
                {isVisible ? <Visible /> : <Invisible />}
            </ActionButton>
            <Tooltip>{isVisible ? t('Hide annotations') : t('Show annotations')}</Tooltip>
        </TooltipTrigger>
    );
};
