// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { isEmpty } from 'lodash-es';

import { t } from '../../../i18n';

export enum OutputFormat {
    IMAGE_ORIGINAL = 'image_original',
    IMAGE_WITH_PREDICTIONS = 'image_with_predictions',
    PREDICTIONS = 'predictions',
}

export enum WebhookHttpMethod {
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
}

const toStringAndTrim = (value: unknown) => String(value).trim();

export const positiveNumberOrUndefined = (value: number | null | undefined): number | undefined => {
    return typeof value === 'number' && value > 0 ? value : undefined;
};

export const getObjectFromFormData = (keys: FormDataEntryValue[], values: FormDataEntryValue[]) => {
    const entries = keys.map((key, index) => [key, values[index]]);
    const validEntries = entries.filter(
        ([key, value]) => !isEmpty(toStringAndTrim(key)) && !isEmpty(toStringAndTrim(value))
    );

    return Object.fromEntries(validEntries);
};

export const rateLimitFromFormData = (formData: FormData): number | null => {
    const samplesValue = formData.get('rate_limit_samples');
    const secondsValue = formData.get('rate_limit_seconds');

    if (samplesValue === null || secondsValue === null) {
        return null;
    }

    const samples = Number(samplesValue);
    const seconds = Number(secondsValue);

    if (!Number.isFinite(samples) || !Number.isFinite(seconds) || samples <= 0 || seconds <= 0) {
        return null;
    }

    return samples / seconds;
};

export const formatRateLimit = (rateLimit?: number | null): string => {
    const normalizedRateLimit = positiveNumberOrUndefined(rateLimit);

    if (normalizedRateLimit === undefined) {
        return t('Not set');
    }

    if (normalizedRateLimit < 1) {
        const seconds = 1 / normalizedRateLimit;
        const normalizedSeconds = Math.round(seconds);
        const secondsLabel = normalizedSeconds === 1 ? t('second') : t('seconds');

        return t('1 sample every {{value0}} {{value1}}', { value0: normalizedSeconds, value1: secondsLabel });
    }

    const normalizedSamples = Math.round(normalizedRateLimit);
    const sampleLabel = normalizedSamples === 1 ? t('sample') : t('samples');

    return t('{{value0}} {{value1}} every 1 second', { value0: normalizedSamples, value1: sampleLabel });
};
