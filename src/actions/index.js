import * as filters from './filtersActions';
import * as hidden from './hiddenColumnsActions';
import * as pagination from './paginationActions';
import * as sortings from './sortingsActions';
import * as totals from './totalsActions';
import * as columns from './columnsActions';
import * as sql from './sqlActions';
import * as url from './urlActions';
import * as transformer from './transformerActions';

export default {
    ...filters,
    ...hidden,
    ...pagination,
    ...sortings,
    ...totals,
    ...columns,
    ...sql,
    ...url,
    ...transformer,
    clear: () => { return {
            type: 'CLEAR'
        }
    },
    clearForColumn: (field) => {
        return {
            type: 'CLEAR_FOR_COLUMN',
            payload: field
        }
    },
    loadState: (state) => {
        return {
            type: 'LOAD_STATE',
            payload: state
        }
    }
};