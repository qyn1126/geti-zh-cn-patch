// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { getLocale, i18n, LANGUAGE_STORAGE_KEY, t } from './config';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

afterEach(async () => {
    await i18n.changeLanguage('en');
});

describe('interface translations', () => {
    it('keeps both catalogs complete and preserves interpolation variables', () => {
        expect(Object.keys(zhCN).sort()).toEqual(Object.keys(en).sort());
        const placeholders = (text: string) => [...text.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1]).sort();
        for (const [key, value] of Object.entries(zhCN)) {
            expect(value.trim(), key).not.toBe('');
            expect(placeholders(value), key).toEqual(placeholders(en[key as keyof typeof en]));
        }
    });

    it('translates UI copy and preserves inserted names and special characters', async () => {
        await i18n.changeLanguage('zh-CN');
        const name = 'Training <test> & 中文';
        expect(t('Are you sure you want to delete project "{{value0}}"?', { value0: name })).toBe(
            '确定要删除项目“Training <test> & 中文”吗？'
        );
        expect(t('Batch size')).toBe('批大小');
        expect(t('An unrecognized backend diagnostic')).toBe('An unrecognized backend diagnostic');
        expect(getLocale()).toBe('zh-CN');
        expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('zh-CN');
    });

    it('falls back to Simplified Chinese for Traditional Chinese locales', async () => {
        await i18n.changeLanguage('zh-HK');
        expect(t('Train model')).toBe('训练模型');
        expect(getLocale()).toBe('zh-CN');
    });

    it('restores English text and formatting', async () => {
        await i18n.changeLanguage('en');
        expect(t('Train model')).toBe('Train model');
        expect(getLocale()).toBe('en-US');
    });
});
