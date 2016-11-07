export function addConditionGroup(parentId, group) {
    return {
        type: 'ADD_CONDITION_GROUP',
        payload: {
            groupId: parentId,
            group: group
        }
    }
}

export function setJunctionType(groupId, junctionType) {
    return {
        type: 'SET_JUNCTION_TYPE',
        payload: {
            groupId,
            junctionType
        }
    }
}

export function clearConditionGroup(id) {
    return {
        type: 'CLEAR_CONDITION_GROUP',
        payload: id
    }
}

export function removeConditionGroup(id) {
    return {
        type: 'REMOVE_CONDITION_GROUP',
        payload: id
    }
}

export function addCondition(groupId, condition) {
    return {
        type: 'ADD_CONDITION',
        payload: {
            groupId,
            condition
        }
    }
}

export function changeConditionField(id, field, type) {
    return {
        type: 'CHANGE_CONDITION_FIELD',
        payload: {
            id,
            field,
            type
        }
    }
}

export function changeConditionOperator(id, operator) {
    return {
        type: 'CHANGE_CONDITION_OPERATOR',
        payload: {
            id,
            operator
        }
    }
}

export function changeConditionValue(id, index, value) {
    return {
        type: 'CHANGE_CONDITION_VALUE',
        payload: {
            id,
            index,
            value
        }
    }
}

export function moveUp(order) {
    return {
        type: 'MOVE_UP',
        payload: order
    }
}

export function moveDown(order) {
    return {
        type: 'MOVE_DOWN',
        payload: order
    }
}

export function removeCondition(id) {
    return {
        type: 'REMOVE_CONDITION',
        payload: id
    }
}

export function clearFilter(id) {
    return {
        type: 'CLEAR_FILTER'
    }
}