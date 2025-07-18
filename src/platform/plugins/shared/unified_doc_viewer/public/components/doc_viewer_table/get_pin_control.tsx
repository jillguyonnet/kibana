/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import {
  EuiButtonIcon,
  EuiDataGridControlColumn,
  EuiIconTip,
  EuiToolTip,
  useEuiTheme,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { css } from '@emotion/react';
import type { FieldRow } from './field_row';

interface PinControlCellProps {
  row: FieldRow;
  onTogglePinned: (fieldName: string) => void;
}

const PinControlCell: React.FC<PinControlCellProps> = React.memo(({ row, onTogglePinned }) => {
  const { euiTheme } = useEuiTheme();

  const fieldName = row.name;
  const isPinned = row.isPinned;
  const label = isPinned
    ? i18n.translate('unifiedDocViewer.docViews.table.unpinFieldLabel', {
        defaultMessage: 'Unpin field',
      })
    : i18n.translate('unifiedDocViewer.docViews.table.pinFieldLabel', {
        defaultMessage: 'Pin field',
      });

  return (
    <div
      data-test-subj={`unifiedDocViewer_pinControl_${fieldName}`}
      className={!isPinned ? 'kbnDocViewer__fieldsGrid__pinAction' : undefined}
      css={css`
        margin-left: ${isPinned ? '-1px' : 0}; // to align filled/unfilled pin icons better
        width: ${euiTheme.size.l};
        height: ${euiTheme.size.l};
        overflow: hidden;
      `}
    >
      <EuiToolTip content={label} delay="long" disableScreenReaderOutput>
        <EuiButtonIcon
          data-test-subj={`unifiedDocViewer_pinControlButton_${fieldName}`}
          iconSize="m"
          iconType={isPinned ? 'pinFilled' : 'pin'}
          color="text"
          aria-label={label}
          onClick={() => {
            onTogglePinned(fieldName);
          }}
        />
      </EuiToolTip>
    </div>
  );
});

export const getPinColumnControl = ({
  rows,
  onTogglePinned,
}: {
  rows: FieldRow[];
  onTogglePinned: (fieldName: string) => void;
}): EuiDataGridControlColumn => {
  const pinColumnHeader = i18n.translate('unifiedDocViewer.fieldsTable.pinControlColumnHeader', {
    defaultMessage: 'Pin field column',
  });

  return {
    id: 'pin_field',
    width: 32,
    headerCellRender: () => (
      <EuiIconTip aria-label={pinColumnHeader} type="info" content={pinColumnHeader} />
    ),
    rowCellRender: ({ rowIndex }) => {
      const row = rows[rowIndex];
      if (!row) {
        return null;
      }
      return (
        <PinControlCell key={`control-${row.name}`} row={row} onTogglePinned={onTogglePinned} />
      );
    },
  };
};
