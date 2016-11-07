export default function(state = "", action) {
    switch (action.type) {
        case 'SET_URL':
            return action.payload;
        case 'LOAD_STATE':
            return action.payload.url;
        default: return state;
    }
}