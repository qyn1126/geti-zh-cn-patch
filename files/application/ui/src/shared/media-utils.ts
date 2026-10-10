// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import * as UTIF from 'utif';

import { t } from '../i18n';

const TIFF_FORMATS = ['tif', 'tiff'];

export const isTiffFormat = (media: { format?: string }): boolean => {
    return TIFF_FORMATS.includes(String(media.format).toLowerCase());
};

export const getImageDataFromTiffUrl = async (url: string): Promise<ImageData> => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                t('Failed to fetch TIFF image from "{{value0}}". HTTP status ' + '{{value1}} {{value2}}', {
                    value0: url,
                    value1: response.status,
                    value2: response.statusText,
                })
            );
        }

        const buffer = await response.arrayBuffer();
        const ifds = UTIF.decode(buffer);

        if (ifds.length === 0) {
            return new ImageData(1, 1);
        }

        const tiff = ifds[0];
        UTIF.decodeImage(buffer, tiff);
        const rgba = UTIF.toRGBA8(tiff);

        return new ImageData(new Uint8ClampedArray(rgba), tiff.width, tiff.height);
    } catch (error) {
        console.error('Failed to decode TIFF image:', error);

        return new ImageData(1, 1);
    }
};
