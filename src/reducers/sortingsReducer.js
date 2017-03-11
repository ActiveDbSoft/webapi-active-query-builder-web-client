export default function(state = [], action) {
    switch (action.type) {
        case 'ORDER_BY':
            return sort(state, action);
        case 'CHANGE_ORDER':
            return changeOrder(state, action);
        case 'REMOVE_ORDER_BY':
            return removeSort(state, action);
        case 'CLEAR_ORDER_BY':
        case 'CLEAR':
            return [];
        case 'CLEAR_FOR_COLUMN':
            return removeSort(state, action);
        case 'LOAD_STATE':
            return loadSort(action.payload.sortings);
        default: return state;
    }
}

function sort(state, action) {
    return state.filter(s => s.field !== action.payload.field)
        .concat({
            field: action.payload.field,
            order: action.payload.order
        });
}

function changeOrder(state, action) {
    const sort = state.find(s => s.field == action.payload.field);

    if (sort === undefined)
        return state;

    sort.order = action.payload.order;

    return [...state]
}

function removeSort(state, action) {
    return state.filter(s => s.field !== action.payload);
}

function loadSort(sortings) {
    return sortings.map(s => {
        return {
            field: s._name,
            order: s._order
        }
    });
}