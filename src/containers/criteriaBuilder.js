import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ConditionGroup from '../components/conditionGroup'
import List from '../components/list'

import Actions from '../actions'

require('../sass/main.scss');

class CriteriaBuilder extends Component {
    state = {
        showList: false,
        left: 0,
        top: 0,
        items: [],
        selectItemCallback: () => {}
    }
    clickHandler(e) {
        const target = e.nativeEvent.target;

        if(target.type === 'number')
            return;

        if(target.className.indexOf('list-opener') === -1)
            this.setState({ showList: false });
    }
    openList(items, left, top, selectItemCallback) {
        this.setState({ showList: true, items, left, top, selectItemCallback });
    }
    renderButton() {
        if(this.props.transformer.criteriaBuilder.autoApply)
            return;

        const text = this.props.sql.failedTransforming ? 'error' : `Apply${this.props.sql.transforming ? '...' : ''}`;

        return <button onClick={this.props.transformer.transform}>{text}</button>
    }
    renderList() {
        if(!this.state.showList)
            return;

        return <List {...this.state} />
    }
    renderClearButton() {
        if(this.props.filter.conditionGroups.length === 0 && this.props.filter.conditions.length === 0)
            return;

        const props = {
            className: "criteria-builder__clear dotted",
            onClick: () => this.props.transformer.criteriaBuilder._clearConditionGroup()
        };

        return <span {...props}>Clear</span>
    }
    renderRootCondition() {
        const props = {
            group: this.props.filter,
            columns: this.props.columns.list,
            openList: ::this.openList,
            addCondition: ::this.props.transformer.criteriaBuilder._addCondition,
            addConditionGroup: ::this.props.transformer.criteriaBuilder._addConditionGroup,
            removeCondition: ::this.props.transformer.criteriaBuilder._removeCondition,
            removeConditionGroup: ::this.props.transformer.criteriaBuilder._removeConditionGroup,
            changeConditionColumnName: ::this.props.transformer.criteriaBuilder._changeConditionColumnName,
            changeConditionOperator: ::this.props.transformer.criteriaBuilder._changeConditionOperator,
            changeConditionValue: ::this.props.transformer.criteriaBuilder._changeConditionValue,
            moveUpCondition: ::this.props.transformer.criteriaBuilder._moveUpCondition,
            moveDownCondition: ::this.props.transformer.criteriaBuilder._moveDownCondition,
            setJunctionType: ::this.props.transformer.criteriaBuilder._setJunctionType,
            clearConditionGroup: ::this.props.transformer.criteriaBuilder._clearConditionGroup,
            //criteriaBuilder: this.props.transformer.criteriaBuilder
        };

        return <ConditionGroup {...props} />
    }
    render() {
        return (
            <div className="criteria-builder" onClick={::this.clickHandler}>
                {::this.renderClearButton()}
                {::this.renderRootCondition()}
                {::this.renderButton()}
                {::this.renderList()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filter: state.filter,
        columns: state.columns ,
        transformer: state.transformer,
        sql: state.sql
    }
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ ...Actions }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(CriteriaBuilder);