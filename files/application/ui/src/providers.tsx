// Copyright (C) 2025 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { ThemeProvider } from '@geti-ui/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { getLocale } from './i18n';
import { queryClient } from './query-client/query-client';
import { router } from './router';

const locale = getLocale();

export const Providers = () => {
    return (
        <QueryClientProvider client={queryClient}>
            {/* Date and number formatting follow the selected interface language. */}
            <ThemeProvider router={router} locale={locale}>
                <RouterProvider
                    router={router}
                    future={{
                        v7_startTransition: true,
                    }}
                />
            </ThemeProvider>
        </QueryClientProvider>
    );
};
