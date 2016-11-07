import JunctionTypes from '../model/junctionTypes'
import { conditionalOperators, conditionalOperatorsParams } from '../model/conditionalOperators'
import { FilterCondition, FilterConditionGroup } from '../model/filterCondition'

export default function(state = new FilterConditionGroup(JunctionTypes.all), action) {
    switch (action.type) {
        case 'ADD_CONDITION_GROUP':
            return addConditionGroup(state, action.payload.groupId, action.payload.group);
        case 'SET_JUNCTION_TYPE':
            return setJunction(state, action.payload.groupId, action.payload.junctionType);
        case 'CLEAR_CONDITION_GROUP':
            return clearConditionGroup(state, action.payload);
        case 'REMOVE_CONDITION_GROUP':
            return removeConditionGroup(state, action.payload);

        case 'ADD_CONDITION':
            return addCondition(state, action.payload.groupId, action.payload.condition);
        case 'CHANGE_CONDITION_FIELD':
            return changeConditionField(state, action.payload.id, action.payload.field, action.payload.type);
        case 'CHANGE_CONDITION_OPERATOR':
            return changeConditionOperator(state, action.payload.id, action.payload.operator);
        case 'CHANGE_CONDITION_VALUE':
            return changeConditionValue(state, action.payload.id, action.payload.index, action.payload.value);
        case 'REMOVE_CONDITION':
            return removeConditionById(state, action.payload);

        case 'MOVE_UP':
            return move(state, action.payload, true);
        case 'MOVE_DOWN':
            return move(state, action.payload, false);
        case 'CLEAR':
        case 'CLEAR_FILTER':
            return new FilterConditionGroup(JunctionTypes.all);
        case 'CLEAR_FOR_COLUMN':
            return removeConditionsByField(state, action.payload);
        case 'LOAD_STATE':
            return action.payload.filter;
        default: return state;
    }
}

function addConditionGroup(state, groupId, conditionGroup) {
    state = JSON.parse(JSON.stringify(state));

    let group = _getGroupById(state, groupId);
    group.conditionGroups.push(conditionGroup);

    return state;
}

function setJunction(state, groupId, junctionType) {
    state = JSON.parse(JSON.stringify(state));

    let group = _getGroupById(state, groupId);
    group.junctionType = junctionType;

    return state;
}

function removeConditionGroup(state, id) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    let parentGroup = null;
    while (stack.length !== 0) {
        let gr = stack.pop();

        if(gr._id === id) {
            parentGroup.conditionGroups.splice(parentGroup.conditionGroups.indexOf(gr), 1);
            stack = [];
        }

        if(gr.conditionGroups.length !== 0) {
            stack.push(...gr.conditionGroups);
            parentGroup = gr;
        }
    }

    return state;
}

function clearConditionGroup(state, id) {
    state = JSON.parse(JSON.stringify(state));

    if(id === undefined)
        return new FilterConditionGroup(JunctionTypes.all)

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        if(gr._id === id) {
            gr.conditions = gr.conditionGroups = [];
            stack = []
        }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function addCondition(state, groupId, condition) {
    state = JSON.parse(JSON.stringify(state));

    let group = _getGroupById(state, groupId);
    group.conditions.push(condition);

    return state;
}

function changeConditionField(state, id, field, type) {
    state = JSON.parse(JSON.stringify(state));
    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++) {
            const condition = gr.conditions[i];
            if (condition._id === id) {
                condition.columnName = field;

                const forTypes = conditionalOperatorsParams.filter(o => o.forTypes.indexOf(type) !== -1);
                if (forTypes.filter(t => t.name === condition.operator).length === 0)
                    condition.operator = conditionalOperators.equal;

                if (type === 'number')
                    condition.values = condition.values.map(v => '' + parseFloat(v)).filter(v => v !== 'NaN');

                stack = [];
            }
        }

        stack.push(...gr.conditionGroups);
    }

    return state;
}

function changeConditionOperator(state, id, operator) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++)
            if(gr.conditions[i]._id === id) {
                gr.conditions[i].operator = operator;
                stack = [];
            }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function changeConditionValue(state, id, index, value) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++)
            if(gr.conditions[i]._id === id) {
                gr.conditions[i].values[index] = value;
                stack = [];
            }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function removeConditionById(state, id) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++)
            if(gr.conditions[i]._id === id) {
                gr.conditions.splice(i, 1);
                stack = [];
            }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function move(state, order, up) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();
        let source = gr.conditionGroups.concat(gr.conditions).sort((a, b) => a._order - b._order);

        for(let i = 0; i < source.length; i++)
            if(source[i]._order === order) {
                if(up) {
                    if(i === 0)
                        stack = [];
                    else {
                        source[i]._order = source[i - 1]._order;
                        source[i - 1]._order = order;
                    }
                } else {
                    if (i === source.length - 1)
                        stack = [];
                    else {
                        source[i]._order = source[i + 1]._order;
                        source[i + 1]._order = order;
                    }
                }
                stack = [];
            }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function removeConditionsByField(state, field) {
    state = JSON.parse(JSON.stringify(state));

    let stack = [ state ];
    while (stack.length !== 0) {
        let gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++)
            if(gr.conditions[i].columnName === field) {
                gr.conditions.splice(i, 1);
                stack = [];
            }

        stack.push(...gr.conditionGroups)
    }

    return state;
}

function _getGroupById(group, id) {
    let stack = [ group ];
    let parentGroup = null;
    while (stack.length !== 0) {
        let gr = stack.pop();

        if(gr._id === id)
            return gr;

        if(gr.conditionGroups.length !== 0) {
            stack.push(...gr.conditionGroups);
            parentGroup = gr;
        }
    }
}