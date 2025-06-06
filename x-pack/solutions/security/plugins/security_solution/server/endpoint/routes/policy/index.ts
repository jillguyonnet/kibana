/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { GetPolicyResponseSchema } from '../../../../common/api/endpoint';
import type { EndpointAppContext } from '../../types';
import { getHostPolicyResponseHandler } from './handlers';
import { BASE_POLICY_RESPONSE_ROUTE } from '../../../../common/endpoint/constants';
import { withEndpointAuthz } from '../with_endpoint_authz';
import type { SecuritySolutionPluginRouter } from '../../../types';

export const INITIAL_POLICY_ID = '00000000-0000-0000-0000-000000000000';

export function registerPolicyRoutes(
  router: SecuritySolutionPluginRouter,
  endpointAppContext: EndpointAppContext
) {
  const logger = endpointAppContext.logFactory.get('endpointPolicy');

  router.versioned
    .get({
      access: 'public',
      path: BASE_POLICY_RESPONSE_ROUTE,
      options: { authRequired: true },
      security: {
        authz: {
          requiredPrivileges: ['securitySolution'],
        },
      },
    })
    .addVersion(
      {
        version: '2023-10-31',
        validate: {
          request: GetPolicyResponseSchema,
        },
      },
      withEndpointAuthz(
        { any: ['canReadSecuritySolution', 'canAccessFleet'] },
        logger,
        getHostPolicyResponseHandler(endpointAppContext.service)
      )
    );
}
