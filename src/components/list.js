import React, { Component, PropTypes } from 'react'

class List extends Component {
    selectItem(item) {
        this.props.selectItemCallback(item);
    }
    renderRow(item, i) {
        const props = {
            className: `criteria-builder__list-item`,
            onClick: () => this.selectItem(item),
            key: i
        };

        return (
            <li {...props}>{item}</li>
        )
    }
    render() {
        const props = {
            className: `criteria-builder__list`,
            style: {
                left: this.props.left,
                top: this.props.top
            }
        };

        return (
            <ul {...props}>
                {this.props.items.map((item, i) => ::this.renderRow(item, i))}
            </ul>
        )
    }
}

List.propTypes = {
    items: PropTypes.array.isRequired,
    selectItemCallback: PropTypes.func.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
};

export default List;