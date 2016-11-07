export function orderBy(field, order) {
    return {
        type: 'ORDER_BY',
        payload: {
            field,
            order
        }
    }
}

export function removeOrderBy(field) {
    return {
        type: 'REMOVE_ORDER_BY',
        payload: field
    }
}

export function clearOrderBy() {
    return {
        type: 'CLEAR_ORDER_BY'
    }
}