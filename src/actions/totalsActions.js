import aggregateFunctions from '../model/aggregateFunctions';

export function avg(field) {
    return total(field, aggregateFunctions.avg)
}

export function count(field) {
    return total(field, aggregateFunctions.count)
}

export function max(field) {
    return total(field, aggregateFunctions.max)
}

export function min(field) {
    return total(field, aggregateFunctions.min)
}

export function sum(field) {
    return total(field, aggregateFunctions.sum)
}

export function total(field, func) {
    return {
        type: 'TOTAL',
        payload: {
            field,
            func
        }
    }
}

export function removeTotal(field, func) {
    return {
        type: 'REMOVE_TOTAL',
        payload: {
            field,
            func
        }
    }
}

export function clearTotals() {
    return {
        type: 'CLEAR_TOTALS'
    }
}