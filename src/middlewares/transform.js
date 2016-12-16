import { startTranforming, failedTransforming, successTranforming } from '../actions/sqlActions'

export default (store) => (next) => (action) => {
    if(action.type !== 'TRANSFORM_QUERY')
        return next(action);

    store.dispatch(startTranforming());
    store.getState().transformer.emit('sendTransform');

    const state = store.getState();

    const model = {
        pagination: state.pagination,
        totals: state.totals,
        sortings: state.sortings,
        filter: filterTraversal( JSON.parse( JSON.stringify(state.filter) ) ),
        hiddenColumns: state.hiddenColumns
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${store.getState().url}/TransformSql`, true);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(model));

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);

            store.dispatch(successTranforming());
            store.getState().transformer.emit('dataReceived', result);
        } else {
            store.dispatch(failedTransforming(xhr.statusText));
            throw `${xhr.status}: ${xhr.statusText}`;
        }
    }
}

function filterTraversal(ConditionGroup) {
    const stack = [ConditionGroup];

    while(stack.length !== 0) {
        const gr = stack.pop();

        for(let i = 0; i < gr.conditions.length; i++) {
            gr.conditions[i].field = gr.conditions[i].columnName; //swagger model has columnName instead field
            gr.conditions[i].values = changeValues(gr.conditions[i].operator, gr.conditions[i].values);
            gr.conditions[i].conditionOperator = changeOperator(gr.conditions[i].operator);
        }

        stack.push(...gr.conditionGroups);
    }

    return ConditionGroup;
}

function changeOperator(operator) {
    switch(operator) {
        case 'IsEmpty':
            return 'Equal';
        case 'IsNotEmpty':
            return 'NotEqual';
        default: return operator;
    }
}

function changeValues(operator, values) {
    switch(operator) {
        case 'IsEmpty':
        case 'IsNotEmpty':
            return [ "" ];
        default: return values;
    }
}