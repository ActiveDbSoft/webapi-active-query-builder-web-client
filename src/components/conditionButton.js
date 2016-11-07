import React, { Component, PropTypes } from 'react';

class ConditionButton extends Component {
    render() {
        const props = {
            onClick: this.props.onClick,
            className: `criteria-builder__button
                        criteria-builder__button--${this.props.junction}
                        criteria-builder__button--condition
                        criteria-builder__list-opener`
        };

        return <div {...props}>.</div>;
    }
}

ConditionButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    junction: PropTypes.string.isRequired
};

export default ConditionButton;