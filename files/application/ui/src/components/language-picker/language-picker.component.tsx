// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Item, Picker } from '@geti-ui/ui';

import { getLocale, t } from '../../i18n';

/** Reload so module-level menu labels and date formatters use the same language. */
export const LanguagePicker = () => (
    <Picker
        aria-label={t('Interface language (reloads the page)')}
        label={t('Language')}
        labelPosition='side'
        width='size-2400'
        selectedKey={getLocale() === 'zh-CN' ? 'zh-CN' : 'en'}
        onSelectionChange={(language) => {
            if (language === null) return;
            const url = new URL(window.location.href);
            url.searchParams.set('lng', String(language));
            window.location.assign(url);
        }}
    >
        <Item key='zh-CN' textValue='简体中文'>
            简体中文
        </Item>
        <Item key='en' textValue='English'>
            English
        </Item>
    </Picker>
);
