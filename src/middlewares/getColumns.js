import { fetchingColumns, failedFetchingColumns, receivedColumns } from '../actions/columnsActions'
import Column from '../model/column';

export default (store) => (next) => (action) => {
    if(action.type !== 'LOAD_COLUMNS')
        return next(action);

    store.dispatch(fetchingColumns());
    store.getState().transformer.emit('startColumnsLoading');

    const url = `${store.getState().url}/GetQueryColumns`;

    const successFunc = (cols) => {
        const columns = cols.map(c => new Column(c.name || c.Name, c.dataType || c.DataType));

        store.dispatch(receivedColumns(columns));
        store.getState().transformer.emit('columnsLoaded', columns);
    };

    const errorFunc = (status, text) => {
        store.dispatch(failedFetchingColumns(text));
        throw `${status}: ${text}`;
    };

    if(window.fetch) {
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
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
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
                successFunc( JSON.parse(xhr.responseText) );
            if (xhr.status === 200) {

            } else {
                errorFunc(xhr.status, xhr.statusText);
            }
        };
    }
}