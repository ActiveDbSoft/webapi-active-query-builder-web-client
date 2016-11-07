import React, { Component, PropTypes } from 'react'
import List from './list'
import { conditionalOperators } from '../model/conditionalOperators'
import JunctionTypes from '../model/junctionTypes'
import Condition from './condition'
import JunctionSelector from './junctionSelector'

class ConditionGroup extends Component {
    openFieldList(left, top) {
        const items = this.props.columns.map(c => c.name);

        this.props.openList(items, left, top, (name) => {
            this.props.addCondition(this.props.group._id, name, conditionalOperators.equal, []);
        });
    }
    openConditionCreatorList(left, top) {
        const items = ['Add condition for column', 'Add group of conditions'];
        let junction = this.props.group.junctionType === JunctionTypes.all ? JunctionTypes.any : JunctionTypes.all;

        this.props.openList(items, left, top, (i) => {
            if(items.indexOf(i) === 0)
                this.props.addCondition(this.props.group._id, undefined, conditionalOperators.equal, []);
            else this.props.addConditionGroup(this.props.group._id, junction);
        });
    }
    openJunctionList(left, top) {
        const items = [JunctionTypes.all, JunctionTypes.any];

        this.props.openList(items, left, top, (type) => {
            this.props.setJunctionType(this.props.group._id, type);
        });
    }
    openGroupFunctionsList(left, top) {
        const items = ['Move up', 'Move down', 'Clear', 'Delete'];

        this.props.openList(items, left, top, (i) => {
            switch (items.indexOf(i)) {
                case 0:
                    this.props.moveUpCondition(this.props.group._order);
                    break;
                case 1:
                    this.props.moveDownCondition(this.props.group._order);
                    break;
                case 2:
                    this.props.clearConditionGroup(this.props.group._id);
                    break;
                case 3:
                    this.props.removeConditionGroup(this.props.group._id);
                    break;
            }
        });
    }
    renderJunctionSelector() {
        const props = {
            junction: this.props.group.junctionType,
            onClick: (e) => ::this.openJunctionList(e.nativeEvent.layerX, e.nativeEvent.layerY)
        };

        return <JunctionSelector {...props} />
    }
    renderJunction() {
        if(!this.props.needJuncBefore)
            return;

        return <span className={'criteria-builder__junction'}>{this.props.junction}</span>;
    }
    renderConditionGroup(key, group, junction) {
        const props = {
            key,
            group,
            junction,
            columns: this.props.columns,
            openList: this.props.openList,
            needJuncBefore: key !== 0,
            setJunctionType: this.props.setJunctionType,
            ...::this._getFunctions(true)
        };

        return <ConditionGroup {...props} />
    }
    renderCondition(key, filter, junction) {
        const props = {
            key,
            filter,
            junction,
            columns: this.props.columns,
            openList: this.props.openList,
            needJuncBefore: key !== 0,
            ...::this._getFunctions(false)
        };

        return <Condition {...props} />
    }
    _getFunctions(isGroup) {
        const conditionFunctions = {
            removeCondition: this.props.removeCondition,
            changeConditionColumnName: this.props.changeConditionColumnName,
            changeConditionOperator: this.props.changeConditionOperator,
            changeConditionValue: this.props.changeConditionValue,
            moveUpCondition: this.props.moveUpCondition,
            moveDownCondition: this.props.moveDownCondition
        };

        if(!isGroup)
            return conditionFunctions;

        return {
            addCondition: this.props.addCondition,
            addConditionGroup: this.props.addConditionGroup,
            removeConditionGroup: this.props.removeConditionGroup,
            clearConditionGroup: this.props.clearConditionGroup,
            ...conditionFunctions
        };
    }
    renderConditions(junc) {
        let conditions = this.props.group.conditions
                         .concat(this.props.group.conditionGroups)
                         .sort((a, b) => a._order - b._order);
        return (
            <div>
                {conditions.map((item, i) =>
                    item._type === "FilterConditionGroup"
                        ? ::this.renderConditionGroup(i, item, junc)
                        : ::this.renderCondition(i, item, junc)
                )}
            </div>
        )
    }
    renderLeftButton(mod) {
        if(mod === undefined)
            return;

        return <div className={`criteria-builder__button
                                criteria-builder__button--${mod}
                                criteria-builder__button--group
                                criteria-builder__list-opener`}
                    onClick={(e) => {
                    ::this.openGroupFunctionsList(e.nativeEvent.layerX, e.nativeEvent.layerY);
                 }}>.</div>;
    }
    renderBottomButton(junc) {
        return (
            <div className={`criteria-builder__button
                             criteria-builder__button--${junc}
                             criteria-builder__button--bottom
                             criteria-builder__list-opener`}
                 onClick={(e) => {
                    ::this.openConditionCreatorList(e.nativeEvent.layerX, e.nativeEvent.layerY);
                 }}>.</div>
        )
    }
    renderNewCondition() {
        return (
            <div className={`criteria-builder__new-condition criteria-builder__list-opener dotted`}
                 onClick={(e) => {
                    ::this.openFieldList(e.nativeEvent.layerX, e.nativeEvent.layerY);
                 }}>[...]</div>
        )
    }
    render() {
        const junc = this.props.group.junctionType === JunctionTypes.all ? 'and' : 'or';
        return (
            <div className={`criteria-builder__condition-group criteria-builder__condition-group--${junc}`}>
                {::this.renderLeftButton(this.props.junction)}
                {::this.renderJunction()}
                {::this.renderJunctionSelector()}
                {::this.renderConditions(junc)}
                {::this.renderBottomButton(junc)}
                {::this.renderNewCondition()}
            </div>
        )
    }
}

ConditionGroup.propTypes = {
    columns: PropTypes.array.isRequired,
    junction: PropTypes.string,
    openList: PropTypes.func.isRequired
};

export default ConditionGroup;