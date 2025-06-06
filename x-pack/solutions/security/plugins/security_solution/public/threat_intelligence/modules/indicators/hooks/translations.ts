/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const DESCRIPTION = i18n.translate(
  'xpack.securitySolution.threatIntelligence.indicatorNameFieldDescription',
  {
    defaultMessage: 'Indicator display name generated in the runtime ',
  }
);

export const INSPECT_BUTTON_TITLE = i18n.translate(
  'xpack.securitySolution.threatIntelligence.inspectTitle',
  {
    defaultMessage: 'Inspect',
  }
);

interface PaginationStatus {
  start: number;
  indicatorCount: number;
  end: number;
}

export const translatePaginationStatus = ({ start, indicatorCount, end }: PaginationStatus) =>
  i18n.translate('xpack.securitySolution.threatIntelligence.paginationStatus', {
    defaultMessage: `Showing {start}-{end} of {indicatorCount} indicators`,
    values: {
      start: start + 1,
      end: end > indicatorCount ? indicatorCount : end,
      indicatorCount,
    },
  });
