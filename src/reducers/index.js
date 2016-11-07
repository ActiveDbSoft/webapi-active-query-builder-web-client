import { combineReducers } from 'redux';

import pagination from './paginationReducer'
import sortings from './sortingsReducer'
import filter from './filterReducer'
import hiddenColumns from './hiddenColumnsReducer'
import totals from './totalsReducer'
import columns from './columnsReducer'
import sql from './sqlReducer'
import url from './urlReducer'
import transformer from './transformerReducer'

export default () => combineReducers({
    pagination,
    sortings,
    filter,
    hiddenColumns,
    totals,
    columns,
    sql,
    url,
    transformer
});