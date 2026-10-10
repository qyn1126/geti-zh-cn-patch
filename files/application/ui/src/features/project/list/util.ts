// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import type { Task, TaskType } from '@/api/types';
import dayjs from 'dayjs';

import { t } from '../../../i18n';
import { isMultiLabelClassificationTask } from '../task-type-guards';

export const formatCreationDate = (creationDate: string) => {
    return dayjs(creationDate).format(t('D MMMM YYYY | h:mm A'));
};

export const MAP_PROJECT_TYPE_TO_TITLE: Record<TaskType, string> = {
    detection: t('Object detection'),
    classification: t('Classification'),
    instance_segmentation: t('Instance segmentation'),
};

export const getProjectTypeTitle = (task?: Task): string | undefined => {
    if (task === undefined) {
        return undefined;
    }

    return isMultiLabelClassificationTask(task)
        ? t('Multi-label classification')
        : MAP_PROJECT_TYPE_TO_TITLE[task.task_type];
};
