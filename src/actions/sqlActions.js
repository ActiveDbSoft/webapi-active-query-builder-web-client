export function transform() {
    return {
        type: 'TRANSFORM_QUERY'
    }
}

export function startTranforming() {
    return {
        type: 'START_TRANSFORMING'
    }
}

export function successTranforming() {
    return {
        type: 'SUCCESS_TRANSFORMING'
    }
}

export function failedTransforming() {
    return {
        type: 'FAILED_TRANSFORMING'
    }
}