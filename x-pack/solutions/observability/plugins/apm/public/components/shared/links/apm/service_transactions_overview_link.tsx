/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiLink } from '@elastic/eui';
import React from 'react';
import type { APMQueryParams } from '../url_helpers';
import type { APMLinkExtendProps } from './apm_link_hooks';
import { useAPMHref } from './apm_link_hooks';
import { removeUndefinedProps } from '../../../../context/url_params_context/helpers';

const persistedFilters: Array<keyof APMQueryParams> = [
  'transactionResult',
  'host',
  'containerId',
  'podName',
  'serviceVersion',
  'latencyAggregationType',
];

interface Props extends APMLinkExtendProps {
  serviceName: string;
  environment?: string;
  transactionType?: string;
}

export function useServiceOrTransactionsOverviewHref({
  serviceName,
  environment,
  transactionType,
}: Props) {
  const query = { environment, transactionType };
  return useAPMHref({
    path: '/services/{serviceName}',
    pathParams: { serviceName },
    persistedFilters,
    query: removeUndefinedProps(query),
  });
}

export function ServiceOrTransactionsOverviewLink({
  serviceName,
  environment,
  transactionType,
  ...rest
}: Props) {
  const href = useServiceOrTransactionsOverviewHref({
    serviceName,
    environment,
    transactionType,
  });
  return (
    <EuiLink data-test-subj="apmServiceOrTransactionsOverviewLinkLink" href={href} {...rest} />
  );
}
