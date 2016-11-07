import aggregateFunctions from '../model/aggregateFunctions';

export default function(state = [], action) {
    switch (action.type) {
        case 'TOTAL':
            return addTotal(state, action.payload.field, action.payload.func);
        case 'REMOVE_TOTAL':
            return removeTotal(state, action.payload.field, action.payload.func);
        case 'CLEAR_TOTALS':
        case 'CLEAR':
            return [];
        case 'CLEAR_FOR_COLUMN':
            return removeTotalsForField(state, action.payload);
        case 'LOAD_STATE':
            return loadTotals(action.payload.totals);
        default: return state;
    }
}

function addTotal(state, field, aggregate) {
    return state.filter(t => t.field !== field || t.aggregate !== aggregate)
        .concat({
            field: field,
            aggregate: aggregate
        });
}

function removeTotal(state, field, aggregate) {
    return state.filter(t => t.field !== field && t.aggregate !== aggregate);
}

function removeTotalsForField(state, field) {
    return state.filter(t => t.field !== field);
}

function loadTotals(totals) {
    return totals.map(t => {
        return {
            field: t._name,
            aggregate: t._func
        }
    });
}