import conditionalOperators from './conditionalOperators'
import SortedColumn from './sortedColumn'
import AggregatedColumn from './aggregatedColumn'
import aggregateFunctions from './aggregateFunctions'
import sortDirections from './sortDirections'
import { FilterCondition, FilterConditionGroup } from './filterCondition'

export default class Column {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    ascending() {
        return new SortedColumn(this.name, sortDirections.asc);
    }

    descending() {
        return new SortedColumn(this.name, sortDirections.desc);
    }

    avg() {
        return new AggregatedColumn(this.name, aggregateFunctions.avg);
    }

    count() {
        return new AggregatedColumn(this.name, aggregateFunctions.count);
    }

    max() {
        return new AggregatedColumn(this.name, aggregateFunctions.max);
    }

    min() {
        return new AggregatedColumn(this.name, aggregateFunctions.min);
    }

    sum() {
        return new AggregatedColumn(this.name, aggregateFunctions.sum);
    }

    total(func) {
        return new AggregatedColumn(this.name, func);
    }

    isNull() {
        return this._createFilterCondition(conditionalOperators.isNull);
    }

    isNotNull() {
        return this._createFilterCondition(conditionalOperators.isNotNull);
    }

    isEmpty() {
        return this._createFilterCondition(conditionalOperators.isEmpty);
    }

    isNotEmpty() {
        return this._createFilterCondition(conditionalOperators.isNotEmpty);
    }

    equal(value) {
        return this._createFilterCondition(conditionalOperators.equal, [value]);
    }

    notEqual(value) {
        return this._createFilterCondition(conditionalOperators.notEqual, [value]);
    }

    less(value) {
        return this._createFilterCondition(conditionalOperators.less, [value]);
    }

    notLess(value) {
        return this._createFilterCondition(conditionalOperators.notLess, [value]);
    }

    lessEqual(value) {
        return this._createFilterCondition(conditionalOperators.lessEqual, [value]);
    }

    notLessEqual(value) {
        return this._createFilterCondition(conditionalOperators.notLessEqual, [value]);
    }

    greater(value) {
        return this._createFilterCondition(conditionalOperators.greater, [value]);
    }

    notGreater(value) {
        return this._createFilterCondition(conditionalOperators.notGreater, [value]);
    }

    greaterEqual(value) {
        return this._createFilterCondition(conditionalOperators.greaterEqual, [value]);
    }

    notGreaterEqual(value) {
        return this._createFilterCondition(conditionalOperators.notGreaterEqual, [value]);
    }

    between(value1, value2) {
        return this._createFilterCondition(conditionalOperators.between, [value1, value2]);
    }

    notBetween(value1, value2) {
        return this._createFilterCondition(conditionalOperators.notBetween, [value1, value2]);
    }

    contains(value) {
        return this._createFilterCondition(conditionalOperators.contains, [value]);
    }

    doesntContain(value) {
        return this._createFilterCondition(conditionalOperators.doesntContain, [value]);
    }

    startsWith(value) {
        return this._createFilterCondition(conditionalOperators.startsWith, [value]);
    }

    doesNotStartWith(value) {
        return this._createFilterCondition(conditionalOperators.doesNotStartWith, [value]);
    }

    endsWith(value) {
        returnthis._createFilterCondition(conditionalOperators.endsWith, [value]);
    }

    doesNotEndWith(value) {
        return this._createFilterCondition(conditionalOperators.doesNotEndWith, [value]);
    }

    filter(operator, values) {
        return this._createFilterCondition(operator, values);
    }

    _createFilterCondition(operator, values) {
        return new FilterCondition(this.name, operator, values);
    }
}