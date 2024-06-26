/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

import { extractQueryParams } from '../../../shared_imports';
import { addCluster as sendAddClusterRequest, getRouter, redirect } from '../../services';
import { fatalError, toasts } from '../../services/notification';

import {
  ADD_CLUSTER_START,
  ADD_CLUSTER_SUCCESS,
  ADD_CLUSTER_FAILURE,
  CLEAR_ADD_CLUSTER_ERRORS,
} from '../action_types';

export const addCluster = (cluster) => async (dispatch) => {
  dispatch({
    type: ADD_CLUSTER_START,
  });

  try {
    await Promise.all([
      sendAddClusterRequest(cluster),
      // Wait at least half a second to avoid a weird flicker of the saving feedback.
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);
  } catch (error) {
    if (error) {
      const { body } = error;

      // Expect an error in the shape provided by http service.
      if (body) {
        const { statusCode, message } = body;
        if (statusCode && statusCode === 409) {
          return dispatch({
            type: ADD_CLUSTER_FAILURE,
            payload: {
              error: {
                message: i18n.translate(
                  'xpack.remoteClusters.addAction.clusterNameAlreadyExistsErrorMessage',
                  {
                    defaultMessage: `A cluster with the name ''{clusterName}'' already exists.`,
                    values: { clusterName: cluster.name },
                  }
                ),
              },
            },
          });
        }

        return dispatch({
          type: ADD_CLUSTER_FAILURE,
          payload: {
            error: {
              message: i18n.translate('xpack.remoteClusters.addAction.failedDefaultErrorMessage', {
                defaultMessage: 'Request failed with a {statusCode} error. {message}',
                values: { statusCode, message },
              }),
            },
          },
        });
      }
    }

    // This error isn't an HTTP error, so let the fatal error screen tell the user something
    // unexpected happened.
    return fatalError.add(
      error,
      i18n.translate('xpack.remoteClusters.addAction.errorTitle', {
        defaultMessage: 'Error adding cluster',
      })
    );
  }

  dispatch({
    type: ADD_CLUSTER_SUCCESS,
  });

  const {
    history,
    route: {
      location: { search },
    },
  } = getRouter();
  const { redirect: redirectUrl } = extractQueryParams(search);

  if (redirectUrl) {
    // A toast is only needed if we're leaving the app.
    toasts.addSuccess(
      i18n.translate('xpack.remoteClusters.addAction.successTitle', {
        defaultMessage: `Added remote cluster ''{name}''`,
        values: { name: cluster.name },
      })
    );

    const decodedRedirect = decodeURIComponent(redirectUrl);
    redirect(`${decodedRedirect}?cluster=${cluster.name}`);
  } else {
    // This will open the new job in the detail panel. Note that we're *not* showing a success toast
    // here, because it would partially obscure the detail panel.
    history.push({
      pathname: `/list`,
      search: `?cluster=${cluster.name}`,
    });
  }
};

export const clearAddClusterErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ADD_CLUSTER_ERRORS,
  });
};
