import React from 'react';
import PropTypes from 'prop-types';
import ReactTable, { ReactTableDefaults } from 'react-table-v6';
import moment from 'moment';

import { formatDataForTable } from '../../../lib/graphs';


const Table = (props) => {
    const {
        data: incomingData,
        columns,
        bucketSize,
    } = props;

    const data = formatDataForTable(incomingData);
    
    const renderCell = (cellProps, accessor, options) => {
        const cellContent = cellProps.original[accessor];
        if (options.temporal && accessor === 'bucket') {
            if (bucketSize === 'hour') {
                return `${moment(cellContent).format('HH:mm')} - ${moment(cellContent).add(59, 'minutes').format('HH:mm')}`;
            }
            return moment(cellContent).format('DD/MM/YYYY');
        }
        if (accessor === 'proportion' || accessor === 'frequency') {
            return `${cellContent}%`;
        }
        return cellProps.original[accessor];
    };

    const renderColumns = () => (
        columns.map(({ header, accessor, ...options }) => (
            {
                id: accessor,
                accessor,
                Header: bucketSize === 'hour' && accessor === 'date' ? 'Time' : header,
                Cell: cellProps => renderCell(cellProps, accessor, options),
            }
        ))
    );

    return (
        <ReactTable
            data={data}
            columns={renderColumns()}
            pageSize={data.length}
            showPagination={false}
            className='table-chart'
            column={{ ...ReactTableDefaults.column, className: 'table-chart-column' }}
        />
    );
};

Table.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    bucketSize: PropTypes.string.isRequired,
};

export default Table;