import { fetchingColumns, failedFetchingColumns, receivedColumns } from '../actions/columnsActions'
import Column from '../model/column';

export default (store) => (next) => (action) => {
    if(action.type !== 'LOAD_COLUMNS')
        return next(action);

    store.dispatch(fetchingColumns());
    store.getState().transformer.emit('startColumnsLoading');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${store.getState().url}/GetQueryColumns`, true);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status === 200) {
            const columns = JSON.parse(xhr.responseText).map(c => new Column(c.name || c.Name, c.dataType || c.DataType));

            store.dispatch(receivedColumns(columns));
            store.getState().transformer.emit('columnsLoaded', columns);
        } else {
            store.dispatch(failedFetchingColumns(xhr.statusText));
            throw `${xhr.status}: ${xhr.statusText}`;
        }
    };
}