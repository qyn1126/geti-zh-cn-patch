// Copyright (C) 2026 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { getMockedJob } from 'mocks/mock-job';
import { getMockedModelArchitecture } from 'mocks/mock-model';
import { getMockedProject } from 'mocks/mock-project';
import { HttpResponse } from 'msw';

import { expect, http, test } from '../fixtures';
import { MOCKED_TRAINING_CONFIGURATION } from '../models/mocks';

test.use({ locale: 'zh-CN' });

test.beforeEach(({ network }) => {
    network.use(
        http.get('/health', () => HttpResponse.json({ status: 'ok' })),
        http.get('/api/projects/{project_id}', () => HttpResponse.json(getMockedProject({ id: 'id-1' }))),
        http.get('/api/projects/{project_id}/models', () => HttpResponse.json([])),
        http.get('/api/projects', () => HttpResponse.json([getMockedProject({ id: 'id-1' })])),
        http.get('/api/model_architectures', () =>
            HttpResponse.json({
                model_architectures: [
                    getMockedModelArchitecture({ id: 'Object_Detection_SSD', name: 'Object_Detection_SSD' }),
                ],
                top_picks: { balance: 'Object_Detection_SSD', speed: '', accuracy: '' },
            })
        ),
        http.get('/api/system/devices/training', () => HttpResponse.json([{ type: 'cpu', name: 'CPU' }])),
        http.get('/api/system/devices/inference', () => HttpResponse.json([{ type: 'cpu', name: 'CPU' }])),
        http.get('/api/projects/{project_id}/pipeline', () =>
            HttpResponse.json({
                project_id: 'id-1',
                status: 'idle',
                source: null,
                sink: null,
                model: null,
                device: 'cpu',
            })
        ),
        http.get('/api/projects/{project_id}/dataset/items', () =>
            HttpResponse.json({
                items: [],
                pagination: { total: 4, count: 0, offset: 0, limit: 10 },
            })
        ),
        http.get('/api/sources', () => HttpResponse.json([])),
        http.get('/api/sinks', () => HttpResponse.json([])),
        http.get('/api/jobs', () => HttpResponse.json([])),
        http.get('/api/projects/{project_id}/dataset_revisions', () => HttpResponse.json([])),
        http.get('/api/projects/{project_id}/training_configuration', () =>
            HttpResponse.json(MOCKED_TRAINING_CONFIGURATION)
        )
    );
});

test('switches languages, persists the choice, and translates static menus after reload', async ({ page, network }) => {
    network.use(http.get('/api/projects', () => HttpResponse.json([])));
    await page.goto('/projects');
    await expect(page.getByRole('button', { name: '创建项目', exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
    await page.getByRole('button', { name: /界面语言/ }).click();
    await page.getByRole('option', { name: 'English' }).click();
    await expect(page.getByRole('button', { name: 'Create new Project' })).toBeVisible();
    await page.goto('/projects');
    await expect(page.getByRole('button', { name: 'Create new Project' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');

    await page.getByRole('button', { name: /Interface language/ }).click();
    await page.getByRole('option', { name: '简体中文' }).click();
    await page.getByRole('button', { name: '创建项目', exact: true }).click();
    await expect(page.getByText('目标检测', { exact: true })).toBeVisible();
    await page.getByRole('radio', { name: 'detection', exact: true }).click();
    await expect(page.getByText('模型需要学习检测哪些对象？')).toBeVisible();
});

test('preserves user project names that also appear in the translation dictionary', async ({ page, network }) => {
    network.use(http.get('/api/projects', () => HttpResponse.json([getMockedProject({ name: 'Training' })])));
    await page.goto('/projects?lng=zh-CN');
    await expect(page.getByRole('heading', { name: 'Training', exact: true })).toBeVisible();
    await expect(page.getByText('目标检测', { exact: true })).toBeVisible();
});

test('localizes dataset navigation, training settings, and inference configuration', async ({ page }) => {
    await page.goto('/projects/id-1/dataset?lng=zh-CN');
    await expect(page.getByRole('tab', { name: '数据集', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '上传媒体' })).toBeVisible();

    await page.goto('/projects/id-1/models?lng=zh-CN');
    await page.getByRole('button', { name: '训练模型' }).click();
    await expect(page.getByRole('heading', { name: '选择要训练的模型' })).toBeVisible();
    await page.getByRole('radio', { name: 'Object_Detection_SSD', exact: true }).click();
    await page.getByRole('button', { name: '高级设置', exact: true }).click();
    await page.getByRole('tab', { name: '训练', exact: true }).click();
    await expect(page.getByText('最大训练轮数', { exact: true })).toBeVisible();
    await expect(page.getByText('批大小', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '取消', exact: true }).click();

    await page.goto('/projects/id-1/inference?lng=zh-CN');
    await expect(page.getByText('流水线配置', { exact: true })).toBeVisible();
    await expect(page.getByRole('switch', { name: '流水线已停用' })).toBeVisible();
});

test('submits original parameter values when options are shown in Chinese', async ({ page, network }) => {
    let submittedConfiguration: unknown;
    network.use(
        http.get('/api/projects/{project_id}/training_configuration', () =>
            HttpResponse.json({
                parameters: MOCKED_TRAINING_CONFIGURATION.parameters.map((group) =>
                    group.type === 'parameter_group' && group.key === 'dataset_preparation'
                        ? { ...group, parameters: group.parameters.filter(({ key }) => key === 'intensity_mapping') }
                        : group
                ),
            })
        ),
        http.patch('/api/projects/{project_id}/training_configuration', async ({ request }) => {
            submittedConfiguration = await request.json();
            return HttpResponse.json({});
        }),
        http.post('/api/jobs', () => HttpResponse.json(getMockedJob(), { status: 201 }))
    );

    await page.goto('/projects/id-1/models?lng=zh-CN');
    await page.getByRole('button', { name: '训练模型' }).click();
    await page.getByRole('radio', { name: 'Object_Detection_SSD', exact: true }).click();
    await page.getByRole('button', { name: '高级设置', exact: true }).click();
    await page.getByRole('button', { name: /选择强度映射模式/ }).click();
    await page.getByRole('option', { name: '窗宽窗位', exact: true }).click();
    await expect(page.getByText('窗位', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '开始', exact: true }).click();

    await expect
        .poll(() => submittedConfiguration)
        .toMatchObject({
            'dataset_preparation.intensity_mapping.mode': 'Windowing',
        });
});
