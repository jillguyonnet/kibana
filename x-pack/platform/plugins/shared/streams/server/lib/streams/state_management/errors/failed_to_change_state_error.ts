/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { StatusError } from '../../errors/status_error';

export class FailedToChangeStateError extends StatusError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'FailedToChangeStateError';
  }
}
