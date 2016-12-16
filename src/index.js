import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import events from 'events';
import getReducers from './reducers/index';
import getMiddlewares from './middlewares/index';
import actions from './actions';
import Column from './model/column';
import CriteriaBuilderJsx from './containers/criteriaBuilder';
import conditionalOperators from './model/conditionalOperators';
import { FilterCondition, FilterConditionGroup } from './model/filterCondition';
import AggregatedColumn from './model/aggregatedColumn';
import SortedColumn from './model/sortedColumn';
import aggregateFunctions from './model/aggregateFunctions';
import junctionTypes from './model/junctionTypes';
import sortDirections from './model/sortDirections';

class QueryTransformer {
    constructor(url) {
        if(typeof url === 'undefined')
            throw 'url can not be null';

        if(url === '' || url === null)
            throw 'url can not be null or empty';

        this._store = createStore(getReducers(), {}, getMiddlewares());

        this._store.dispatch( actions.setUrl(url) );
        this._store.dispatch( actions.setTransformer(this) );

        this._store.subscribe(() => {
            this.emit('changed', this);
        });

        this._hiddenColumns = new HiddenColumn(this._store);
        this._pagination = new Pagination(this._store);
        this._sortings = new Sorting(this._store);
        this._totals = new Total(this._store);
        this._filter = new Filter(this._store);
        this._criteriaBuilder = new CriteriaBuilder(this._store);

        _.extend(this, new events.EventEmitter());
    }

    get url() {
        return this._store.getState().url;
    }

    get hiddenColumns() {
        return this._hiddenColumns;
    }

    get pagination() {
        return this._pagination;
    }

    get sortings() {
        return this._sortings;
    }

    get totals() {
        return this._totals;
    }

    get filter() {
        return this._filter;
    }

    get criteriaBuilder() {
        return this._criteriaBuilder;
    }

    clear() {
        this._store.dispatch( actions.clear() );
    }

    clearAllForColumn(name) {
        this._store.dispatch( actions.clearForColumn(name) );
    }

    saveState() {
        return JSON.stringify(this._getState());
    }

    _getState() {
        return {
            columns: this.getColumnList(),
            pagination: {
                skip: this.pagination.skipCount,
                take: this.pagination.takeCount
            },
            sortings: this.sortings.getSortings(),
            totals: this.totals.getTotals(),
            filter: this.filter.getFilter(),
            hiddenColumns: this.hiddenColumns.getColumns(),
            url: this.url
        }
    }
    loadState(str) {
        const state = JSON.parse(str);
        this._store.dispatch( actions.loadState(state) );
    }

    loadColumns() {
        this._store.dispatch( actions.loadColumns() );
    }

    getColumnList() {
        return this._store.getState().columns.list.map((c) => new Column(c.name, c.type));
    }

    columnByName(name) {
        let column = _.find(this._store.getState().columns.list, c => c.name === name);

        if(column === undefined)
            throw `Column '${name}' not found`;

        return new Column(column.name, column.type);
    }

    transform() {
        this._store.dispatch( actions.transform() );
    }
}

class HiddenColumn {
    constructor(store) {
        this._store = store;
    }
    getColumns() {
        return this._store.getState().hiddenColumns.map((hc) => hc.field);
    }
    hide(object) {
        if(typeof object === 'string')
            this._store.dispatch( actions.hideColumn(object) );
        else
            this._store.dispatch( actions.hideColumn(object.name) );

        return this;
    }
    show(object) {
        if(typeof object === 'string')
            this._store.dispatch( actions.showColumn(object) );
        else
            this._store.dispatch( actions.showColumn(object.name) );

        return this;
    }
    clear() {
        this._store.dispatch( actions.clearHiddenColumns() );
    }
}

class Total {
    constructor(store) {
        this._store = store;
    }
    getTotals() {
        return this._store.getState().totals.map((t) => new AggregatedColumn(t.field, t.aggregate));
    }
    avg(columnName) {
        this._store.dispatch( actions.avg(columnName) );
        return this;
    }
    count(columnName) {
        this._store.dispatch( actions.count(columnName) );
        return this;
    }
    max(columnName) {
        this._store.dispatch( actions.max(columnName) );
        return this;
    }
    min(columnName) {
        this._store.dispatch( actions.min(columnName) );
        return this;
    }
    sum(columnName) {
        this._store.dispatch( actions.sum(columnName) );
        return this;
    }
    addTotal(columnName, func) {
        this._store.dispatch( actions.total(columnName, func) );
        return this;
    }
    removeTotal(columnName, func) {
        this._store.dispatch( actions.removeTotal(columnName, func) );
        return this;
    }
    add(aggregatedColumn) {
        this._store.dispatch( actions.total(aggregatedColumn.name, aggregatedColumn.func) );
        return this;
    }
    clear() {
        this._store.dispatch( actions.clearTotals() );
        return this;
    }
}

class Sorting {
    constructor(store) {
        this._store = store;
    }
    getSortings() {
        return this._store.getState().sortings.map((s) => new SortedColumn(s.field, s.order));
    }
    orderBy(columnName, order) {
        this._store.dispatch( actions.orderBy(columnName, order) );
        return this;
    }
    removeOrderBy(columnName) {
        this._store.dispatch( actions.removeOrderBy(columnName) );
        return this;
    }
    add(sortedColumn) {
        this._store.dispatch( actions.orderBy(sortedColumn.name, sortedColumn.order) );
        return this;
    }
    clear() {
        this._store.dispatch( actions.clearOrderBy() );
        return this;
    }
}

class Pagination {
    constructor(store) {
        this._store = store;
    }
    get skipCount() {
        return this._store.getState().pagination.skip;
    }
    set skipCount(count) {
        this._store.dispatch( actions.skip(count) );
        return this;
    }
    get takeCount() {
        return this._store.getState().pagination.take;
    }
    set takeCount(count) {
        this._store.dispatch( actions.take(count) );
        return this;
    }
    set(skip, take) {
        this._store.dispatch( actions.page(skip, take) );
    }
    clear() {
        this._store.dispatch( actions.page(0, 0) );
        return this;
    }
}

class Filter {
    constructor(store) {
        this._store = store;
    }
    getFilter() {
        const state = this._store.getState().filter;

        const func = function f(srcGroup) {
            const conditions = srcGroup.conditions;
            const conditionGroups = srcGroup.conditionGroups;

            const targetGroup = new FilterConditionGroup(srcGroup.junctionType);

            for(let i = 0; i < conditions.length; i++) {
                const srcCondition = conditions[i];
                const targetCondition = new FilterCondition(srcCondition.columnName, srcCondition.operator, srcCondition.values);
                targetGroup.conditions.push(targetCondition);
            }

            for(let i = 0; i < conditionGroups.length; i++) {
                const newGroup = f(conditionGroups[i], targetGroup);
                targetGroup.conditionGroups.push(newGroup);
            }

            return targetGroup;
        };

        return func(state);
    }
    isNull(columnName) {
        this._addConditionToRoot(columnName, conditionalOperators.isNull, []);
        return this;
    }
    isNotNull(columnName) {
        this._addConditionToRoot(columnName, conditionalOperators.isNotNull, []);
        return this;
    }
    isEmpty(columnName) {
        this._addConditionToRoot(columnName, conditionalOperators.isEmpty, []);
        return this;
    }
    isNotEmpty(columnName) {
        this._addConditionToRoot(columnName, conditionalOperators.isNotEmpty, []);
        return this;
    }
    equal(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.equal, [value]);
        return this;
    }
    notEqual(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.notEqual, [value]);
        return this;
    }
    less(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.less, [value]);
        return this;
    }
    notLess(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.notLess, [value]);
        return this;
    }
    lessEqual(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.lessEqual, [value]);
        return this;
    }
    notLessEqual(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.notLessEqual, [value]);
        return this;
    }
    greater(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.greater, [value]);
        return this;
    }
    notGreater(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.notGreater, [value]);
    }
    greaterEqual(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.greaterEqual, [value]);
        return this;
    }
    notGreaterEqual(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.notGreaterEqual, [value]);
        return this;
    }
    between(columnName, fromValue, toValue) {
        this._addConditionToRoot(columnName, conditionalOperators.between, [fromValue, toValue]);
        return this;
    }
    notBetween(columnName, fromValue, toValue) {
        this._addConditionToRoot(columnName, conditionalOperators.notBetween, [fromValue, toValue]);
        return this;
    }
    contains(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.contains, [value]);
        return this;
    }
    doesntContain(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.doesntContain, [value]);
        return this;
    }
    startsWith(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.startsWith, [value]);
        return this;
    }
    doesNotStartWith(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.doesNotStartWith, [value]);
        return this;
    }
    endsWith(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.endsWith, [value]);
        return this;
    }
    doesNotEndWith(columnName, value) {
        this._addConditionToRoot(columnName, conditionalOperators.doesNotEndWith, [value]);
        return this;
    }
    addFilter(columnName, operator, values) {
        this._addConditionToRoot(columnName, operator, values);
        return this;
    }
    add(object) {
        if(object._type === 'FilterCondition')
            this._store.dispatch( actions.addCondition(this._getRootFilterId(), object) );
        else if(object._type === 'FilterConditionGroup')
            this._store.dispatch( actions.addConditionGroup(this._getRootFilterId(), object) );
        return this;
    }
    clear() {
        this._store.dispatch( actions.clearFilter() );
    }
    _addConditionToRoot(columnName, operator, values) {
        const condition = new FilterCondition(columnName, operator, values);
        this._store.dispatch( actions.addCondition(this._getRootFilterId(), condition) );
    }
    _getRootFilterId() {
        return this._store.getState().filter._id;
    }
}

class CriteriaBuilder {
    constructor(store) {
        this._store = store;
    }
    init(id) {
		if(document.getElementById(id) === null)
			throw `Element with id="${id}" is not found`;
		
        ReactDOM.render(
            <Provider store={this._store}>
                <CriteriaBuilderJsx />
            </Provider>,
        document.getElementById(id));
    }
    autoApply = false;
    _moveUpCondition(order) {
        this._dispatch( actions.moveUp(order) );
        return this;
    }
    _moveDownCondition(order) {
        this._dispatch( actions.moveDown(order) );
        return this;
    }
    _addCondition(groupId, columnName, operator, values) {
        this._dispatch( actions.addCondition( groupId, new FilterCondition(columnName, operator, values)) );
        return this;
    }
    _changeConditionColumnName(id, columnName, type) {
        this._dispatch( actions.changeConditionField(id, columnName, type) );
        return this;
    }
    _changeConditionOperator(id, operator) {
        this._dispatch( actions.changeConditionOperator(id, operator) );
        return this;
    }
    _changeConditionValue(id, index, value) {
        this._dispatch( actions.changeConditionValue(id, index, value) );
        return this;
    }
    _removeCondition(id) {
        this._dispatch( actions.removeCondition(id) );
        return this;
    }
    _addConditionGroup(groupId, junctionType) {
        this._dispatch( actions.addConditionGroup(groupId, new FilterConditionGroup(junctionType, groupId)) );//do i really need groupId?
        return this;
    }
    _clearConditionGroup(groupId) {
        this._dispatch( actions.clearConditionGroup(groupId) );
        return this;
    }
    _removeConditionGroup(groupId) {
        this._dispatch( actions.removeConditionGroup(groupId) );
        return this;
    }
    _setJunctionType(groupId, junctionType) {
        this._dispatch( actions.setJunctionType(groupId, junctionType) );
        return this;
    }
    _validate() {
        const stack = [this._store.getState().filter];
        while(stack.length !== 0) {
            const conditionGroup = stack.pop();

            if(conditionGroup.conditions.length === 0 && conditionGroup.conditionGroups.length === 0)
                return conditionGroup._parentId === undefined;

            const conditions = conditionGroup.conditions;

            for(let i = 0; i < conditions.length; i++)
                if(!this._validateCondition(conditions[i]))
                    return false;

            stack.push(...conditionGroup.conditionGroups);
        }
        return true;
    }
    _validateCondition(condition) {
        if(typeof condition.columnName === 'undefined')
            return false;

        switch (condition.operator) {
            case 'IsNull':
            case 'IsNotNull':
            case 'IsEmpty':
            case 'IsNotEmpty':
                return true;
            case 'Between':
            case 'NotBetween':
                if(condition.values.length !== 2)
                    return false;
                if(condition.values[0] === '' || condition.values[1] === '')
                    return false;
            default:
                if(condition.values.length === 0)
                    return false;
                if(condition.values[0] === '')
                    return false;
        }

        return true;
    }
    _dispatch(action) {
        this._store.dispatch(action);
        if(this.autoApply && this._validate())
            this._store.dispatch( actions.transform() );
    }
}

exports.QueryTransformer = QueryTransformer;
exports.Column = Column;
exports.AggregatedColumn = AggregatedColumn;
exports.SortedColumn = SortedColumn;
exports.FilterCondition = FilterCondition;
exports.FilterConditionGroup = FilterConditionGroup;

exports.AggregateFunctions = aggregateFunctions;
exports.JunctionTypes = junctionTypes;
exports.ConditionalOperators = conditionalOperators;
exports.SortDirections = sortDirections;