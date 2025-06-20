/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithI18n } from '@kbn/test-jest-helpers';

import { InspectorPanel } from './inspector_panel';
import { InspectorViewDescription } from '../types';
import { Adapters } from '../../common';
import type { ApplicationStart, HttpSetup, IUiSettingsClient } from '@kbn/core/public';
import { SharePluginStart } from '@kbn/share-plugin/public';
import { sharePluginMock } from '@kbn/share-plugin/public/mocks';
import { applicationServiceMock, themeServiceMock } from '@kbn/core/public/mocks';
import { settingsServiceMock } from '@kbn/core-ui-settings-browser-mocks';
import type { SettingsStart } from '@kbn/core-ui-settings-browser';
import { ThemeServiceStart } from '@kbn/core/public';

describe('InspectorPanel', () => {
  let adapters: Adapters;
  let views: InspectorViewDescription[];

  const dependencies = {
    application: applicationServiceMock.createStartContract(),
    http: {},
    share: sharePluginMock.createStartContract(),
    uiSettings: {},
    settings: settingsServiceMock.createStartContract(),
    theme: themeServiceMock.createStartContract(),
  } as unknown as {
    application: ApplicationStart;
    http: HttpSetup;
    share: SharePluginStart;
    uiSettings: IUiSettingsClient;
    settings: SettingsStart;
    theme: ThemeServiceStart;
  };

  beforeEach(() => {
    adapters = {
      foodapter: {
        foo() {
          return 42;
        },
      },
      bardapter: {},
    };

    views = [
      {
        title: 'View 1',
        order: 200,
        component: () => <h1>View 1</h1>,
      },
      {
        title: 'Foo View',
        order: 100,
        component: () => <h1>Foo view</h1>,
        shouldShow(adapters2: Adapters) {
          return adapters2.foodapter;
        },
      },
      {
        title: 'Never',
        order: 200,
        component: () => null,
        shouldShow() {
          return false;
        },
      },
    ];
  });

  it('should render title and default view correctly', () => {
    renderWithI18n(
      <InspectorPanel adapters={adapters} views={views} dependencies={dependencies} />
    );

    // Panel title
    expect(screen.getByRole('heading', { name: /Inspector/i })).toBeInTheDocument();

    // Selected view label in dropdown
    expect(screen.getByText('View: View 1')).toBeInTheDocument();

    // Rendered content of the selected view
    expect(screen.getByRole('heading', { name: 'View 1' })).toBeInTheDocument();
  });

  it('should not allow updating adapters', () => {
    const { rerender } = renderWithI18n(
      <InspectorPanel adapters={adapters} views={views} dependencies={dependencies} />
    );

    // Mutate adapters (simulate external change)
    adapters.notAllowed = {};

    expect(() =>
      rerender(<InspectorPanel adapters={adapters} views={views} dependencies={dependencies} />)
    ).toThrow();
  });
});
