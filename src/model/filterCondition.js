import junctionTypes from './junctionTypes'

function idGenerator() {
    let groupId = 0;
    return function() {
        return groupId++;
    }
}

const generateGroupId = idGenerator();
const generateConditionId = idGenerator();
const generateOrder = idGenerator();

class FilterCondition {
    constructor(columnName, operator, values) {
        this._id = generateConditionId();
        this.columnName = columnName;
        this.operator = operator;
        this.values = values;
        this._order = generateOrder();

        this._type = 'FilterCondition';
    }
}

class FilterConditionGroup {
    constructor(junction, parentId) {
        if(junction !== junctionTypes.all && junction !== junctionTypes.any)
            throw 'Junction type should be in [All, Any]';

        this._id = generateGroupId();
        this._order = generateOrder();
        this._type = 'FilterConditionGroup';
        this._parentId = parentId;

        this.junctionType = junction;
        this.conditions = [];
        this.conditionGroups = [];
    }
    add(object) {
        if(object._type === 'FilterCondition')
            this.conditions.push(object);
        else
            this.conditionGroups.push(object);
    }
    clear() {
        this.conditions = [];
        this.conditionGroups = [];
    }
}

exports.FilterCondition = FilterCondition;
exports.FilterConditionGroup = FilterConditionGroup;