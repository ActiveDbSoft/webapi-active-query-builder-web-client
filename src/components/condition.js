import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { conditionalOperators, conditionalOperatorsParams } from '../model/conditionalOperators';
import Value from './value';
import ConditionButton from './conditionButton';
import ConditionField from './conditionField';

class Condition extends Component {
    openFieldList(left, top) {
        const items = this.props.columns.map(c => c.name);

        this.props.openList(items, left, top, (field) => {
            const column = _.find(this.props.columns, c => c.name === field);
            this.props.changeConditionColumnName(this.props.filter._id, column.name, this._getJSType(column.type));
        });
    }
    openOperatorList(left, top) {
        const field = _.find(this.props.columns, c => c.name === this.props.filter.columnName);

        if(field === undefined)
            return;

        const items = conditionalOperatorsParams.map(o => {
            if(o.forTypes.indexOf( this._getJSType(field.type) ) !== -1)
                return o.text
        }).filter(o => o !== undefined);

        this.props.openList(items, left, top, (text) => {
            const operator = _.find(conditionalOperatorsParams, o => o.text === text);
            this.props.changeConditionOperator(this.props.filter._id, operator.name);
        });
    }
    _getJSType(type) { //todo дублирование с функцией _getInputType
        switch (type) {
            case 'number':
            case 'int':
                return 'number';
            case 'string':
            case 'varchar':
            case 'nvarchar':
                return 'string';
            case 'datetime':
            case 'time':
                return 'datetime';
            case 'object':
                return 'string';
            default:
                throw `unknown column type '${type}'`
        }
    }
    openFunctionList(left, top) {
        const items = ['Move up', 'Move down', 'Delete'];

        this.props.openList(items, left, top, (i) => {
            switch (items.indexOf(i)) {
                case 0:
                    this.props.moveUpCondition(this.props.filter._order);
                    break;
                case 1:
                    this.props.moveDownCondition(this.props.filter._order);
                    break;
                case 2:
                    this.props.removeCondition(this.props.filter._id);
                    break;
            }
        });
    }
    renderButton() {
        const props = {
            onClick: (e) => ::this.openFunctionList(e.nativeEvent.layerX, e.nativeEvent.layerY),
            junction: this.props.junction
        };

        return <ConditionButton {...props} />
    }
    renderJunction() {
        if(!this.props.needJuncBefore)
            return;

        return <span className={'criteria-builder__junction'}>{this.props.junction}</span>;
    }
    renderField() {
        const props = {
            field: this.props.filter.columnName,
            onClick: (e) => ::this.openFieldList(e.nativeEvent.layerX, e.nativeEvent.layerY)
        };

        return <ConditionField {...props} />
    }
    renderOperator() {
        const props = {
            className: "criteria-builder__condition-operator criteria-builder__list-opener dotted",
            onClick: (e) => ::this.openOperatorList(e.nativeEvent.layerX, e.nativeEvent.layerY)
        };

        const text = _.find(conditionalOperatorsParams, o => o.name === this.props.filter.operator).text;

        return <span {...props}>{text}</span>
    }
    renderValues() {
        const column = _.find(this.props.columns, c => c.name === this.props.filter.columnName);
        const type = column ? column.type : 'string';
        const values = [];
        const valueCount = _.find(conditionalOperatorsParams, o => o.name === this.props.filter.operator).valueCount;

        for(let i = 0; i < valueCount; i++) {
            const props = {
                key: i,
                value: this.props.filter.values[i],
                type: type,
                valueChanged: (v) => { this.props.changeConditionValue(this.props.filter._id, i, v) },
                junction: i !== 0 ? 'and' : ''
            };

            values.push(<Value {...props} />);
        }

        return <span className="criteria-builder__condition-values">{values}</span>
    }
    render() {
        return (
            <div className="criteria-builder__condition">
                {::this.renderButton()}
                {::this.renderJunction()}
                {::this.renderField()}
                {::this.renderOperator()}
                {::this.renderValues()}
            </div>
        )
    }
}

Condition.propTypes = {
    filter: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    junction: PropTypes.string,
    openList: PropTypes.func.isRequired
};

export default Condition;