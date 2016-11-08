import React, { Component, PropTypes } from 'react';
import DateTime from './myDateTime';
import moment from 'moment';

class Value extends Component {
    valueChanged() {
        let value;

        if(this._input.state !== undefined) //работа с компонентом DateTime
            value = this._input.state.inputValue;
        else
            value = this._input.value;

        if(value !== this.props.value)
            this.props.valueChanged(value);

        this.setState({ showEditor: false })
    }
    keyUpHandler(e) {
        if(e.nativeEvent.keyCode === 13)
            ::this.valueChanged();
    }
    renderLabel() {
        if(this.state !== null && this.state.showEditor)
            return;

        const props = {
            className:`dotted ${this.props.value === undefined || this.props.value.trim() === "" ? 'red' : ''}`,
            onClick: () => this.setState({ showEditor: true })
        };

        return (
            <span {...props}>{this.props.value || '[enter value]'}</span>
        )
    }
    renderEditor() {
        if(this.state === null || !this.state.showEditor)
            return;

        const type = this._getInputType(this.props.type);

        if(type === 'datetime' || type === 'time')
            return ::this._renderDateTime(type);

        return ::this._renderInput(type);
    }
    _renderInput(type) {
        const ref = (input) => {
            if (input != null) {
                input.focus();
                input.value = this.props.value || '';
            }
            this._input = input
        };

        const props = {
            ref,
            type,
            onBlur: ::this.valueChanged,
            onKeyUp: ::this.keyUpHandler
        };

        return <input {...props} />
    }
    _renderDateTime(type) {
        const dateFormatString = 'DD/MM/YYYY';
        const timeFormatString = 'HH:mm:ss';

        const dateFormat = type === 'datetime' ? dateFormatString : false;
        const timeFormat = type === 'datetime' || type === 'time' ? timeFormatString : false;

        const defaultValue = this.props.value === undefined
            ? moment(new Date(), `${dateFormatString} ${timeFormatString}`).startOf('day')
            : moment(this.props.value, `${dateFormatString} ${timeFormatString}`);

        const ref = (input) => {
            if(input !== null) {
                input.openCalendar();
                this._input = input;
            }
        };

        const props = {
            ref,
            defaultValue,
            dateFormat,
            timeFormat,
            onBlur: ::this.valueChanged
        };

        return <DateTime {...props} />
    }
    _getInputType(type) {//todo дублирование с функцией _getJSType
        switch (type) {
            case 'number':
            case 'int':
                return 'number';
            case 'string':
            case 'varchar':
            case 'nvarchar':
                return 'text';
            case 'datetime':
                return 'datetime';
            case 'time':
                return 'time';
            case 'object':
                return 'text';
            default:
                throw `unknown column type '${type}'`
        }
    }
    renderJunction() {
        return <span className="criteria-builder__junction">{this.props.junction}</span>
    }
    render() {
        return (
            <span>
                {::this.renderJunction()}
                {::this.renderLabel()}
                {::this.renderEditor()}
            </span>
        )
    }
}

Value.propTypes = {
    type: PropTypes.string.isRequired,
    valueChanged: PropTypes.func.isRequired
};

export default Value;