/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isEqual, intersection, union } from 'lodash';
import { FilterManager } from '@kbn/data-plugin/public';
import type { LensDocument } from '../persistence';
import { AnnotationGroups, DatasourceMap, VisualizationMap } from '../types';
import { removePinnedFilters } from './save_modal_container';

const removeNonSerializable = (obj: Parameters<JSON['stringify']>[0]) =>
  JSON.parse(JSON.stringify(obj));

export const isLensEqual = (
  doc1In: LensDocument | undefined,
  doc2In: LensDocument | undefined,
  injectFilterReferences: FilterManager['inject'],
  datasourceMap: DatasourceMap,
  visualizationMap: VisualizationMap,
  annotationGroups: AnnotationGroups
) => {
  if (doc1In === undefined || doc2In === undefined) {
    return doc1In === doc2In;
  }

  // we do this so that undefined props are the same as non-existant props
  const doc1 = removeNonSerializable(doc1In);
  const doc2 = removeNonSerializable(doc2In);

  if (doc1?.visualizationType !== doc2?.visualizationType) {
    return false;
  }

  if (!isEqual(doc1.state.query, doc2.state.query)) {
    return false;
  }

  const isEqualFromVis = visualizationMap[doc1.visualizationType]?.isEqual;
  const visualizationStateIsEqual = isEqualFromVis
    ? (() => {
        try {
          return isEqualFromVis(
            doc1.state.visualization,
            doc1.references,
            doc2.state.visualization,
            doc2.references,
            annotationGroups
          );
        } catch (err) {
          return false;
        }
      })()
    : isEqual(doc1.state.visualization, doc2.state.visualization);

  if (!visualizationStateIsEqual) {
    return false;
  }

  // data source equality
  const availableDatasourceTypes1 = Object.keys(doc1.state.datasourceStates);
  const availableDatasourceTypes2 = Object.keys(doc2.state.datasourceStates);

  // simple comparison
  let datasourcesEqual =
    intersection(availableDatasourceTypes1, availableDatasourceTypes2).length ===
    union(availableDatasourceTypes1, availableDatasourceTypes2).length;

  if (datasourcesEqual) {
    // deep comparison
    datasourcesEqual = availableDatasourceTypes1.every((type) =>
      datasourceMap[type].isEqual(
        doc1.state.datasourceStates[type],
        doc1.references.concat(doc1.state.internalReferences || []),
        doc2.state.datasourceStates[type],
        doc2.references.concat(doc2.state.internalReferences || [])
      )
    );
  }

  if (!datasourcesEqual) {
    return false;
  }

  const [filtersInjected1, filtersInjected2] = [doc1, doc2].map((doc) =>
    removePinnedFilters(injectDocFilterReferences(injectFilterReferences, doc))
  );
  if (!isEqual(filtersInjected1?.state.filters, filtersInjected2?.state.filters)) {
    return false;
  }

  return true;
};

function injectDocFilterReferences(
  injectFilterReferences: FilterManager['inject'],
  doc?: LensDocument
) {
  if (!doc) return undefined;
  return {
    ...doc,
    state: {
      ...doc.state,
      filters: injectFilterReferences(doc.state?.filters || [], doc.references),
    },
  };
}
