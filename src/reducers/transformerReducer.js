export default function(state = {}, action) {
    switch (action.type) {
        case 'SET_TRANSFORMER':
            return action.payload;
        default: return state;
    }
}