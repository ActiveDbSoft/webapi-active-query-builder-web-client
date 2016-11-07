function getInitialState() {
    return {
        skip: null,
        take: null
    }
}

export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'PAGE':
            return {
                skip: action.payload.skip,
                take: action.payload.take
            };
        case 'SKIP':
            return { ...state, skip: action.payload };
        case 'TAKE':
            return { ...state, take: action.payload };
        case 'CLEAR':
            return getInitialState();
        case 'LOAD_STATE':
            return action.payload.pagination;
        default: return state;
    }
}