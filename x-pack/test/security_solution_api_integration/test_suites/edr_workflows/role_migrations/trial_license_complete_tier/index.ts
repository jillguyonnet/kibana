/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { FtrProviderContext } from '../../../../ftr_provider_context_edr_workflows';

export default function endpointAPIIntegrationTests({ loadTestFile }: FtrProviderContext) {
  describe('Endpoint related user role migrations', function () {
    loadTestFile(require.resolve('./siem_v3_global_artifact_management'));
  });
}
