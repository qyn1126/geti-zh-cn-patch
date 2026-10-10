// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Link } from '@geti-ui/ui';

import { t } from '../../../../i18n';

type ParentRevisionModelProps = {
    id: string | undefined;
    name: string;
    onExpandModel?: (id: string) => void;
};

export const ParentRevisionModel = ({ id, name, onExpandModel }: ParentRevisionModelProps) => {
    return (
        <>
            {t('Fine-tuned from')}{' '}
            <Link
                UNSAFE_style={{ textDecoration: 'none' }}
                onPress={() => {
                    if (id) {
                        onExpandModel?.(id);
                    }
                }}
            >
                {name}
            </Link>
        </>
    );
};
