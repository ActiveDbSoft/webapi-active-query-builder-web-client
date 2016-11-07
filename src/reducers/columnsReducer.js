function getInitialState() {
    return {
        list: [],
        fetching: false,
        failedFatching: false
    }
}

export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'FETCHING_COLUMNS':
            return { ...state, fetching: true, failedFatching: false };
        case 'RECEIVED_COLUMNS':
            return { list: action.payload, fetching: false, failedFatching: false };
        case 'FAILED_FETCHING_COLUMNS':
            return { ...state, fetching: false, failedFatching: true };
        case 'LOAD_STATE':
            return { ...state, list: action.payload.columns };
        default: return state;
    }
}