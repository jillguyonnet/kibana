/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';

import { lazy } from 'react';
import { InspectorViewDescription } from '../../types';
import { Adapters } from '../../../common';

const RequestsViewComponent = lazy(() =>
  import('../../async_services').then((module) => ({ default: module.RequestsViewComponent }))
);

export const getRequestsViewDescription = (): InspectorViewDescription => ({
  title: i18n.translate('inspector.requests.requestsTitle', {
    defaultMessage: 'Requests',
  }),
  order: 20,
  help: i18n.translate('inspector.requests.requestsDescriptionTooltip', {
    defaultMessage: 'View the search requests used to collect the data',
  }),
  shouldShow: (adapters: Adapters) => Boolean(adapters.requests),
  component: RequestsViewComponent,
});
