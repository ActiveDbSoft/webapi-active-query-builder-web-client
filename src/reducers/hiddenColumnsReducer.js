import _ from 'lodash';

export default function(state = [], action) {
    switch (action.type) {
        case 'HIDE_COLUMN':
            return hideColumn(state, action);
        case 'SHOW_COLUMN':
            return showColumn(state, action);
        case 'SHOW_ALL':
        case 'CLEAR':
            return [];
        case 'CLEAR_FOR_COLUMN':
            return showColumn(state, action);
        case 'LOAD_STATE':
            return loadHiddenColumns(action.payload.hiddenColumns);
        default: return state;
    }
}

function hideColumn(state, action) {
    let column = _.find(state, c => c.field === action.payload);
    if(column !== undefined)
        return state;

    return state.concat({
        field: action.payload
    });
}

function showColumn(state, action) {
    let column = _.find(state, s => s.field === action.payload);
    if(column === undefined)
        return state;

    let newState = state.slice();
    newState.splice(state.indexOf(column), 1);
    return newState;
}

function loadHiddenColumns(hiddenColumns) {
    return hiddenColumns.map(hc => {
        return {
            field: hc
        }
    });
}