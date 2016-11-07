export function loadColumns() {
    return {
        type: 'LOAD_COLUMNS'
    }
}

export function fetchingColumns() {
    return {
        type: 'FETCHING_COLUMNS'
    }
}

export function receivedColumns(columns) {
    return {
        type: 'RECEIVED_COLUMNS',
        payload: columns
    }
}

export function failedFetchingColumns() {
    return {
        type: 'FAILED_FETCHING_COLUMNS'
    }
}