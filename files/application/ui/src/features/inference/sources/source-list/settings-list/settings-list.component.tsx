// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { $api } from '@/api';
import type { SourceConfig } from '@/api/types';

import { t } from '../../../../../i18n';

import classes from './settings-list.module.scss';

interface SettingsListProps {
    source: SourceConfig;
}

const CameraDeviceDisplay = ({ deviceId }: { deviceId: number }) => {
    const { data: cameraDevices = [], isLoading } = $api.useQuery('get', '/api/system/devices/camera');
    const device = cameraDevices.find(({ index }) => index === deviceId);

    if (isLoading) {
        return <span>{t('Loading...')}</span>;
    }

    return (
        <ul className={classes.list}>
            <li>
                {t('Device: ')}
                {device ? device.name : t('Unknown device (id: {{value0}})', { value0: deviceId })}
            </li>
        </ul>
    );
};

export const SettingsList = ({ source }: SettingsListProps) => {
    if (source.source_type === 'images_folder') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Folder path: ')}
                    {source.images_folder_path}
                </li>
                <li>
                    {t('Ignore existing images: ')}
                    {source.ignore_existing_images ? t('Yes') : t('No')}
                </li>
            </ul>
        );
    }

    if (source.source_type === 'ip_camera') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Stream url: ')}
                    {source.stream_url}
                </li>
                <li>
                    {t('Auth required: ')}
                    {source.auth_required ? t('Yes') : t('No')}
                </li>
            </ul>
        );
    }

    if (source.source_type === 'video_file') {
        return (
            <ul className={classes.list}>
                <li>
                    {t('Video path: ')}
                    {source.video_path}
                </li>
            </ul>
        );
    }

    if (source.source_type === 'usb_camera') {
        return <CameraDeviceDisplay deviceId={source.device_id} />;
    }

    return <></>;
};
