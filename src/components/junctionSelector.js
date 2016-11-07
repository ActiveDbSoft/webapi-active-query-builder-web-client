import React, { Component, PropTypes } from 'react';

class JunctionSelector extends Component {
    render() {
        const props = {
            className: "criteria-builder__list-opener dotted",
            onClick: this.props.onClick
        };

        return (
            <span>
                <span style={{marginLeft: 5}}>Where </span>
                <span {...props}>{this.props.junction}</span>
                <span> of the following succeed</span>
            </span>
        )
    }
}

JunctionSelector.propTypes = {
    junction: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default JunctionSelector;