export function skip(count) {
    return {
        type: 'SKIP',
        payload: count
    }
}

export function take(count) {
    return {
        type: 'TAKE',
        payload: count
    }
}

export function page(skip, take) {
    return {
        type: 'PAGE',
        payload: {
            skip,
            take
        }
    }
}