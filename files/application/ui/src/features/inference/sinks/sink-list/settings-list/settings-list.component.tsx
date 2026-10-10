// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import type { SinkConfig, SinkOutputFormats, WebhookSinkConfig } from '@/api/types';

import { t } from '../../../../../i18n';
import { removeUnderscore } from '../../../util';
import { formatRateLimit } from '../../utils';
import { getPairsFromObject } from '../../webhook/utils';

import classes from './settings-list.module.scss';

type SettingsListProps = {
    sink: SinkConfig;
};

const OutputFormats = ({ outputFormats }: { outputFormats: SinkOutputFormats }) => {
    return (
        <ul>
            {outputFormats.map((item) => (
                <li key={item}>{removeUnderscore(item)}</li>
            ))}
        </ul>
    );
};

const WebhookHeaders = ({ sink }: { sink: WebhookSinkConfig }) => {
    return (
        <ul>
            {getPairsFromObject(sink.headers ?? {}).map((pair) => (
                <li key={pair.key}>
                    {pair.key}: {pair.value}
                </li>
            ))}
        </ul>
    );
};

export const SettingsList = ({ sink }: SettingsListProps) => {
    if (sink.sink_type === 'folder') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Folder path: ')}
                    {sink.folder_path}
                </li>
                <li>
                    {t('Rate limit: ')}
                    {formatRateLimit(sink.rate_limit)}
                </li>
                <li>
                    {t('Output formats: ')}
                    <OutputFormats outputFormats={sink.output_formats} />
                </li>
            </ul>
        );
    }

    if (sink.sink_type === 'webhook') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Rate limit: ')}
                    {formatRateLimit(sink.rate_limit)}
                </li>
                <li>
                    {t('HTTP method: ')}
                    {sink.http_method}
                </li>
                <li>
                    {t('Timeout: ')}
                    {sink.timeout}
                </li>
                <li>
                    {t('Webhook URL: ')}
                    {sink.webhook_url}
                </li>
                <li>
                    {t('Headers ')}
                    <WebhookHeaders sink={sink} />
                </li>
                <li>
                    {t('Output formats: ')}
                    <OutputFormats outputFormats={sink.output_formats} />
                </li>
            </ul>
        );
    }

    if (sink.sink_type === 'mqtt') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Topic: ')}
                    {sink.topic}
                </li>
                <li>
                    {t('Rate limit: ')}
                    {formatRateLimit(sink.rate_limit)}
                </li>
                <li>
                    {t('Auth required: ')}
                    {sink.auth_required ? t('Yes') : t('No')}
                </li>
                <li>
                    {t('Broker host: ')}
                    {sink.broker_host}
                </li>
                <li>
                    {t('Broker port: ')}
                    {sink.broker_port}
                </li>
                <li>
                    {t('Output formats: ')}
                    <OutputFormats outputFormats={sink.output_formats} />
                </li>
            </ul>
        );
    }

    if (sink.sink_type === 'ros') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Topic: ')}
                    {sink.topic}
                </li>
                <li>
                    {t('Rate limit: ')}
                    {formatRateLimit(sink.rate_limit)}
                </li>
                <li>
                    {t('Output formats: ')}
                    <OutputFormats outputFormats={sink.output_formats} />
                </li>
            </ul>
        );
    }

    return <></>;
};
