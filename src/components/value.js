import React, { Component, PropTypes } from 'react';
import DateTime from 'react-datetime';

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

        let ref = (input) => {
            if (input != null) {
                input.focus();
                input.value = this.props.value || '';
            }
            this._input = input
        };

        const type = this._getInputType(this.props.type);

        if(type === 'datetime' || type === 'time') {
            return <DateTime
                ref={(input) => {
                    if(input !== null) {
                        input.openCalendar();
                        this._input = input;
                    }
                }}
                dateFormat={type === 'datetime'}
                timeFormat="HH:mm:ss"
                onBlur={::this.valueChanged}
                onKeyUp={::this.keyUpHandler}
                defaultValue={this.props.value || new Date()} />
        }

        const props = {
            ref: ref,
            onBlur: ::this.valueChanged,
            onKeyUp: ::this.keyUpHandler,
            type
        };

        return <input {...props} />
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