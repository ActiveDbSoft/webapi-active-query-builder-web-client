function getInitialState() {
    return {
        transforming: false,
        successTransforming: false,
        failedTransforming: false
    }
}

export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'START_TRANSFORMING':
            return { ...state, transforming: true, failedTransforming: false };
        case 'SUCCESS_TRANSFORMING':
            return { successTransforming: true, transforming: false, failedTransforming: false };
        case 'FAILED_TRANSFORMING':
            return { ...state, transforming: false, failedTransforming: true };
        default: return state;
    }
}