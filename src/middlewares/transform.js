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
        filter: filterTraversal( JSON.parse( JSON.stringify(state.filter, (key, value) => {
            if(key === 'junctionType')
                return value.charAt(0).toUpperCase() + value.slice(1); //todo case sensitive
            if(key === '_id')
               return undefined;
            else if(key === '_order')
                return undefined;
            else if(key === '_parentId')
                return undefined;
            else if(key === '_type')
                return undefined;
            else
                return value;
        }) ) ),
        hiddenColumns: state.hiddenColumns
    };

    const url = `${store.getState().url}/TransformSql`;

    const successFunc = (data) => {
        store.dispatch(successTranforming());
        store.getState().transformer.emit('dataReceived', data);
    };

    const errorFunc = (status, text) => {
        store.dispatch(failedTransforming(text));
        throw `${status}: ${text}`;
    };

    if(window.fetch) {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(model),
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=UTF-8'
            })
        })
        .then(res => {
            res.json().then(json => successFunc(json));
        })
        .catch(res => {
            console.log(res);
        });
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(JSON.stringify(model));

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
                successFunc( JSON.parse(xhr.responseText) );
            if (xhr.status === 200) {

            } else {
                errorFunc(xhr.status, xhr.statusText);
            }
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