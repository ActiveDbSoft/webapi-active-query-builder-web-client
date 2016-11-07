export function hideColumn(field) {
    return {
        type: 'HIDE_COLUMN',
        payload: field
    }
}

export function showColumn(field) {
    return {
        type: 'SHOW_COLUMN',
        payload: field
    }
}

export function clearHiddenColumns() {
    return {
        type: 'SHOW_ALL'
    }
}