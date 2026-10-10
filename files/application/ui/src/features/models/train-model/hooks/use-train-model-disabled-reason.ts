// Copyright (C) 2025-2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { useGetDatasetItems } from 'hooks/use-get-dataset-items.hook';

import { getLocale, t } from '../../../../i18n';
import { pluralizeItems } from '../../../../shared/util';

const MIN_NUMBER_OF_ANNOTATED_ITEMS = 3;

export const useTrainModelDisabledReason = () => {
    const { totalCount, isPending: isTotalPending } = useGetDatasetItems({ annotationStatus: 'with_annotations' });
    const { totalCount: trainingSubsetSize, isPending: isTrainingPending } = useGetDatasetItems({
        annotationStatus: 'with_annotations',
        subsets: ['training'],
    });
    const { totalCount: testingSubsetSize, isPending: isTestingPending } = useGetDatasetItems({
        annotationStatus: 'with_annotations',
        subsets: ['testing'],
    });
    const { totalCount: validationSubsetSize, isPending: isValidationPending } = useGetDatasetItems({
        annotationStatus: 'with_annotations',
        subsets: ['validation'],
    });
    const { totalCount: reviewedUnassignedSubsetSize, isPending: isReviewedUnassignedPending } = useGetDatasetItems({
        annotationStatus: 'with_annotations',
        subsets: ['unassigned'],
    });
    const { totalCount: unassignedSubsetSize, isPending: isUnassignedPending } = useGetDatasetItems({
        subsets: ['unassigned'],
    });

    if (
        isTotalPending ||
        isTrainingPending ||
        isTestingPending ||
        isValidationPending ||
        isReviewedUnassignedPending ||
        isUnassignedPending
    ) {
        return { reason: undefined };
    }

    if (totalCount < MIN_NUMBER_OF_ANNOTATED_ITEMS) {
        return {
            reason:
                t(
                    'In order to train a model, you need to annotate at least 3 items ' +
                        'in your dataset, although we '
                ) + t('recommend annotating several more for better results.'),
        };
    }

    const subsetSizes = [
        { name: 'training', value: trainingSubsetSize },
        { name: 'validation', value: validationSubsetSize },
        { name: 'testing', value: testingSubsetSize },
    ];

    const emptySubsets = subsetSizes.filter(({ value }) => value === 0);

    if (emptySubsets.length === 0 || emptySubsets.length <= reviewedUnassignedSubsetSize) {
        return { reason: undefined };
    }

    const emptySubsetNames = emptySubsets.map(({ name }) => t(name));
    const listFormatter = new Intl.ListFormat(getLocale(), { style: 'long', type: 'conjunction' });
    const emptySubsetText =
        emptySubsetNames.length === 1
            ? t('{{value0}} subset is', { value0: emptySubsetNames[0] })
            : t('{{value0}} subsets are', { value0: listFormatter.format(emptySubsetNames) });

    const unannotatedUnassignedSize = unassignedSubsetSize - reviewedUnassignedSubsetSize;

    let assignmentDetail: string;

    if (reviewedUnassignedSubsetSize > 0 && unannotatedUnassignedSize > 0) {
        assignmentDetail = t(
            'there are {{reviewed}} reviewed {{reviewedItems}} ready to assign and ' +
                '{{unannotated}} {{unannotatedItems}} that still need annotation ' +
                'before they can be assigned',
            {
                reviewed: reviewedUnassignedSubsetSize,
                reviewedItems: pluralizeItems(reviewedUnassignedSubsetSize),
                unannotated: unannotatedUnassignedSize,
                unannotatedItems: pluralizeItems(unannotatedUnassignedSize),
            }
        );
    } else if (reviewedUnassignedSubsetSize > 0) {
        assignmentDetail = t('there are {{count}} reviewed {{items}} left to assign', {
            count: reviewedUnassignedSubsetSize,
            items: pluralizeItems(reviewedUnassignedSubsetSize),
        });
    } else if (unannotatedUnassignedSize > 0) {
        assignmentDetail = t(
            unannotatedUnassignedSize === 1
                ? 'there is {{count}} {{items}} that still need annotation before they can be assigned'
                : 'there are {{count}} {{items}} that still need annotation before they can be assigned',
            { count: unannotatedUnassignedSize, items: pluralizeItems(unannotatedUnassignedSize) }
        );
    } else {
        assignmentDetail = t('there are no unassigned items available to redistribute');
    }

    return {
        reason:
            t(
                'In order to train a model, each subset (training, validation, ' +
                    'testing) needs at least one ' +
                    'item. '
            ) +
            t('This condition is currently not satisfiable, because the ' + '{{value0}} empty and ', {
                value0: emptySubsetText,
            }) +
            `${assignmentDetail}.`,
    };
};
