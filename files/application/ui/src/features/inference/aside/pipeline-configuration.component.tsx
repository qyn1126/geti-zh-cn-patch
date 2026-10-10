// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ReactNode, Suspense } from 'react';

import { Flex, Item, Loading, TabList, TabPanels, Tabs, Text, View } from '@geti-ui/ui';

import { FEATURE_FLAGS } from '../../../constants/feature-flags';
import { t } from '../../../i18n';
import { SinkActions } from '../sinks/sink-actions.component';
import { SourceActions } from '../sources/source-actions.component';
import { PipelineConfidenceThreshold } from './pipeline-confidence-threshold.component';
import { StreamInferenceDevices } from './stream-inference-devices.component';

const ConfigurationItem = ({ children }: { children: ReactNode }) => {
    return (
        <View position={'relative'} minHeight={'size-800'}>
            <Suspense fallback={<Loading mode={'inline'} size={'M'} />}>{children}</Suspense>
        </View>
    );
};

export const PipelineConfiguration = () => {
    return (
        <Flex direction={'column'} gap={'size-150'} minHeight={0}>
            <Suspense fallback={<Loading />}>
                <StreamInferenceDevices />
            </Suspense>

            {FEATURE_FLAGS.CONFIDENCE_THRESHOLD && <PipelineConfidenceThreshold />}

            <Tabs
                aria-label={t('Pipeline configuration tabs')}
                flex={1}
                minHeight={0}
                UNSAFE_style={{
                    '--spectrum-tabs-selection-indicator-color': 'var(--energy-blue)',
                }}
            >
                <TabList marginBottom={'size-200'}>
                    <Item key='sources' textValue={t('Sources')}>
                        <Text>{t('Input')}</Text>
                    </Item>
                    <Item key='sinks' textValue={t('Sinks')}>
                        <Text>{t('Output')}</Text>
                    </Item>
                </TabList>
                <TabPanels flex={1} minHeight={0} UNSAFE_style={{ overflowY: 'auto' }}>
                    <Item key='sources'>
                        <ConfigurationItem>
                            <SourceActions />
                        </ConfigurationItem>
                    </Item>
                    <Item key='sinks'>
                        <ConfigurationItem>
                            <SinkActions />
                        </ConfigurationItem>
                    </Item>
                </TabPanels>
            </Tabs>
        </Flex>
    );
};
