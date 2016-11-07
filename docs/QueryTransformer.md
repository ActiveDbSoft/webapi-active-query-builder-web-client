## QueryTransformer class

### Description
Non-visual object to exchange data with the server. Gets list of columns from the server and sends transformation directives to the server.

### Remarks
The *columnsLoaded* and *dataReceived* events must be handled in order to display data returned from the server.

To save and restore the user's instructions between work sessions use the *saveState* and *loadState* methods. After restoring the component's state you can read user's instructions using the appropriate get* methods to set up HTML controls. The Criteria Builder control will be restored automatically.

### Constructor:
Name         | Parameters    | Description
------------ | ------------- | -------------
QueryTransformer | url: string | Creates new instance of the QueryTransformer class passing the URL of the server access point to exchange data with.

### Properties:
Name         | Type          | Description
------------ | ------------- | -------------
url (read-only) | string | Gets URL of the server access point to exchange data with.
filter (read-only) | [Filter](/docs/Filter.md) | Helper class to manipulate with filter conditions.
sortings (read-only) | [Sorting](/docs/Sorting.md) | Helper class to manipulate with sortings.
hiddenColumns (read-only) | [HiddenColumn](/docs/HiddenColumn.md) | Helper class to manipulate with hidden columns.
pagination (read-only) | [Pagination](/docs/Pagination.md) | Helper class to apply pagination.
totals (read-only) | [Total](/docs/Total.md) | Helper class to define totals.
criteriaBuilder (read-only) | [CriteriaBuilder](/docs/CriteriaBuilder.md) | Gets access to the Criteria Builder visual control to define filter conditions.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | -------------
transform | - | - | Sends transformation instructions to the server. The *dataReceived* event will be fired on receiving response from server.
loadColumns | - | - | Sends request to get list of query columns. The *columnsLoaded* event will be fired on receiving response from server.
saveState | - | string | Gets the component's state to save it between work sessions.
loadState | state: string  | - | Loads the component's state on resuming work session.
clear | - | - | Deletes all transformation instructions.
clearAllForColumn | columnName: string  | - | Deletes all instructions for a column
getColumnList | - | array() [Column](/docs/Column.md) | Returns array of loaded columns.
columnByName | columnName: string | [Column](/docs/Column.md) | Returns Column object by column name.

### Events:
Name         | Parameters    | Description
------------ | ------------- | -------------
startColumnsLoading | - | Fired when the component sends the GetQueryColumns command to the server. You can display some animation until the process is completed.
columnsLoaded | array() Column | Fired when columns have been loaded from the server. Provides array of query columns returned from server. This event can be used to initialize the data HTML control by filling it's columns list.
changed | QueryTransformer (self) | Fired when the component's state has been changed (some instructions have been added or removed from the list).
sendTransform | - | Fired when the component sends the TransformSql command to the server. You can display some animation until the process is completed.
dataReceived | <Data> | Fired when data has been returned from the server. Result depends on the server-side handler.