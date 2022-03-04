import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';
import './Table.scss';

const DIRECTIONS = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

class CustomTable extends Component {
  handleCaret = (columnSort) => {
    const { currentOrder, direction } = this.props;
    if (columnSort === currentOrder) {
      switch (direction) {
        case DIRECTIONS.ASCENDING:
          return 'caret up';
        case DIRECTIONS.DESCENDING:
          return 'caret down';
        default:
          return '';
      }
    }
    return 'caret down';
  };

  handleSort = (clickedColumn) => {
    const { onSortBy } = this.props;
    onSortBy(clickedColumn);
  };

  renderColumnsContent = (columns, row) => {
    const { rowAction, includeRowAction } = this.props;
    return columns.map(({ dataIndex, render }) => {
      const onClick = (e) => (includeRowAction ? rowAction(e, row.id) : {});
      return (
        <Table.Cell key={dataIndex} onClick={onClick}>
          {render && typeof render === 'function'
            ? render(...dataIndex.split(' ').map((key) => row[key]))
            : row[dataIndex]}
        </Table.Cell>
      );
    });
  };

  renderTableContent = (dataSource) => {
    const { columns } = this.props;
    return dataSource.map((row) => (
      <Table.Row
        key={row.id}
        {...(row.className && { className: row.className })}
      >
        {this.renderColumnsContent(columns, row)}
      </Table.Row>
    ));
  };

  render() {
    const { dataSource, columns, currentOrder } = this.props;
    return (
      <div className="TableContainer">
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.HeaderCell
                  key={column.dataIndex}
                  onClick={() =>
                    column.sortBy && this.handleSort(column.sortBy)
                  }
                  {...(column.sortBy &&
                    column.sortBy === currentOrder && { className: 'active' })}
                >
                  <div className="table__title">
                    <span>{column.title}</span>
                    {column.title && column.sortBy && (
                      <Icon name={this.handleCaret(column.sortBy)} />
                    )}
                  </div>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body className="table__body">
            {this.renderTableContent(dataSource)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

CustomTable.propTypes = {
  onSortBy: PropTypes.func,
  rowAction: PropTypes.func,
  includeRowAction: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape),
  dataSource: PropTypes.arrayOf(PropTypes.shape),
  direction: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  currentOrder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
};

export default withRouter(CustomTable);
