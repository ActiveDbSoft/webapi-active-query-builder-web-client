import React, { Component, PropTypes } from 'react';

class ConditionField extends Component {
    render() {
        const props = {
            onClick: this.props.onClick,
            className: `criteria-builder__condition-field
                        criteria-builder__list-opener
                        ${this.props.field === undefined ? 'red' : ''}
                        dotted`
        };

        return <span {...props}>{this.props.field || '[select column]'}</span>
    };
}

ConditionField.propTypes = {
    field: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default ConditionField;