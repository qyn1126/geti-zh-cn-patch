// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';

import { t } from '../i18n';

const DATE_TIME_FORMAT = t('DD MMM YYYY, hh:mm A');

const formatFilterDate = (date: string): string => dayjs(date).format('DD/MM/YYYY HH:mm');

export const formatDateRangeStart = (date: string): string => t('From {{value0}}', { value0: formatFilterDate(date) });

export const formatDateRangeEnd = (date: string): string => t('To {{value0}}', { value0: formatFilterDate(date) });

export const formatDateTime = (dateString: string | null | undefined, fallback = '-'): string => {
    if (!dateString) return fallback;

    const date = dayjs(dateString);

    return date.isValid() ? date.format(DATE_TIME_FORMAT) : fallback;
};

export const formatTrainingDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';

    const date = dayjs(dateString);

    if (!date.isValid()) return '-';

    //      01 Oct 2025
    //      11:07 AM
    return date.format(t('DD MMM YYYY\nhh:mm A'));
};
