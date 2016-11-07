# Web Client for Active Query Builder Web API

Ready-to-use JavaScript library that helps to  implement **ad-hoc SQL query builder** for non-technical end users. It uses  **Active Query Builder Web API**, a cloud service for SQL query creation, analysis and modification. 

## Compatibility
Web browser     | Internet Explorer | Chrome | Mozilla | Opera | Safari
--------------- | ----------------- | ------ | ------- | ----- | ------ 
Minimal version | 10                | 30     | 5       | 6     | 8

## Description
Web Client for [Active Query Builder Web API]() is designed for the purpose of building full-featured web interface to work with result data of arbitrary SQL query. The component acts like **Online Visual Query Builder**: it allows your end-users to sort, filter and browse paginated data, by modifying the given SQL query according to user instructions.

## Remarks
The idea of this web client was to let the web users to browse data from large datasets using a full-featured interactive user interface to browse massive data sets while passing a minimum amount of data to the client. This is not another one HTML data grid control. You can use any third-party grid controls (which allow for the necessary customization) with Active Query Builder API or create your own one. This library lets send the user's query modification instructions to the server and receive data in return in an easy way.

This library also provides a handy HTML control to manage filter conditions in a tree-like form.

Learn more at [https://webapi.activequerybuilder.com](https://webapi.activequerybuilder.com/).

## Getting started
##### How to initialize the QueryTransformer control?
QueryTransformer requires a URL of the server access point to be passed to the constructor:

    var queryTransformer = new ActiveQueryBuilder.QueryTransformer("http://localhost:53489");

##### How to initialize Criteria Builder control?
To display the Criteria Builder control, call the QueryTransformer.criteriaBuilder.*init* method and pass the id of the container HTML element as a parameter:

    queryTransformer.criteriaBuilder.init("html_element_id");
    
##### How to link the QueryTransformer object to the grid control?
Pass the user's actions to appropriate methods of the QueryTransformer class and call the QueryTransformer.*transform* method to send commands to the server. Handle the QueryTransformer.*dataReceived* event to display data in return.

Read more details and find code samples in remarks for the [QueryTransformer](~/docs/QueryTransformer.md) class and it's helper classes.

##### How to configure the web server to work with the component?
In order to operate with this library, a server access point that's capable to handle the following requests is necessary.

Request         | Parameters    | Return value     | Description
--------------- | ------------- | ---------------- | -------------
GetQueryColumns | -             | ColumnList       | Returns list of query columns.
TransformSql    | Transform     | <Free-form data> | Gets transformation commands from the client and returns data to be displayed.

*ColumnList* and *Transform* are JSON-encoded string of the structure described on the [Active Query Builder API Definition page](). See the [Active Query Builder Web API HTML Demo page]() to find sample of these handlers.

## Class reference
### Classes
Class name | Description
---------- | -----------
[QueryTransformer](~/docs/QueryTransformer.md) | Non-visual object to exchange data with the server. Gets list of columns from the server and sends transformation directives to the server.
[CriteriaBuilder](~/docs/CriteriaBuilder.md) | Visual control to define conditions by the end-user.
[Filter](~/docs/Filter.md) | Helper class of the QueryTransformer to work with sortings.
[Sorting](~/docs/Sorting.md) | Helper class of the QueryTransformer to work with sortings.
[HiddenColumn](~/docs/HiddenColumn.md) | Helper class of the QueryTransformer to show/hide columns. 
[Pagination](~/docs/Pagination.md) | Helper class of the QueryTransformer to work with pagination. 
[Total](~/docs/Total.md) | Helper class of the QueryTransformer to work with totals.
[Column](~/docs/Column.md) | Represents single query column.
[AggregatedColumn](~/docs/AggregatedColumn.md) | Defines aggregation for a column. 
[SortedColumn](~/docs/SortedColumn.md) | Defines sorting for a column.
[FilterCondition](~/docs/FilterCondition.md) | Defines single condition for a column.
[FilterConditionGroup](~/docs/FilterConditionGroup.md) | Defines group of conditions.

### Enumerations
Enumeration | Description
----------- | -----------
[junctionTypes](~/docs/junctionTypes.md) | Lists all possible junction types to be used to join conditions.
[aggregateFunctions](~/docs/aggregateFunctions.md) | Lists all possible aggregate functions that can be used to calculate totals.
[conditionalOperators](~/docs/conditionalOperators.md) | Lists all possible conditional operators to be used to build conditions.
[sortDirections](~/docs/sortDirections.md) | Lists all possible sort directions.

--------------------------------------------------------------------
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
filter (read-only) | [Filter](~/docs/Filter.md) | Helper class to manipulate with filter conditions.
sortings (read-only) | [Sorting](~/docs/Sorting.md) | Helper class to manipulate with sortings.
hiddenColumns (read-only) | [HiddenColumn](~/docs/HiddenColumn.md) | Helper class to manipulate with hidden columns.
pagination (read-only) | [Pagination](~/docs/Pagination.md) | Helper class to apply pagination.
totals (read-only) | [Total](~/docs/Total.md) | Helper class to define totals.
criteriaBuilder (read-only) | [CriteriaBuilder](~/docs/CriteriaBuilder.md) | Gets access to the Criteria Builder visual control to define filter conditions.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
transform | - | - | Sends transformation instructions to the server. The *dataReceived* event will be fired on receiving response from server.
loadColumns | - | - | Sends request to get list of query columns. The *columnsLoaded* event will be fired on receiving response from server.
saveState | - | string | Gets the component's state to save it between work sessions.
loadState | state: string  | - | Loads the component's state on resuming work session.
clear | - | - | Deletes all transformation instructions.
clearAllForColumn | columnName: string  | - | Deletes all instructions for a column
getColumnList | - | array() [Column](~/docs/Column.md) | Returns array of loaded columns.
columnByName | columnName: string | [Column](~/docs/Column.md) | Returns Column object by column name.

### Events:
Name         | Parameters    | Description
------------ | ------------- | ------------- 
startColumnsLoading | - | Fired when the component sends the GetQueryColumns command to the server. You can display some animation until the process is completed.
columnsLoaded | array() Column | Fired when columns have been loaded from the server. Provides array of query columns returned from server. This event can be used to initialize the data HTML control by filling it's columns list.
changed | QueryTransformer (self) | Fired when the component's state has been changed (some instructions have been added or removed from the list).
sendTransform | - | Fired when the component sends the TransformSql command to the server. You can display some animation until the process is completed.
dataReceived | <Data> | Fired when data has been returned from the server. Result depends on the server-side handler.


--------------------------------------------------------------------
## Sorting class
### Description
Helper class of QueryTransformer to work with sortings. Can be accessed via the [QueryTransformer](~/docs/QueryTransformer.md).*sortings* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.sortings
      .orderBy("column1", SortDirections.asc)
      .orderBy("column2", SortDirections.desc); 
    queryTrasformer.transform();

### Methods:
Name        | Parameters     | Return value  | Description
------------ | ------------- | ------------- | ------------- 
orderBy | columnName: string, order: [SortDirections](~/docs/SortDirections.md) | Sorting (self) | Sets sort order for a column. If several columns are involded in sorting data, the *order* parameter determines priority among the other sorted columns.
removeOrderBy | columnName: string | Sorting (self) | Removes the specified column from the list of sortings.
add | sortedColumn: [SortedColumn](~/docs/SortedColumn.md) | Sorting (self) | Adds SortedColumn object to the list of sorted columns.
clear | - | - | Deletes all sorting directives.
getSortings | - | array() [SortedColumn](~/docs/SortedColumn.md) | Returns a copy of sorted columns array.

--------------------------------------------------------------------
## HiddenColumn class
### Description
Helper class of QueryTransformer to show/hide columns. Can be accessed via the [QueryTransformer](~/docs/QueryTransformer.md).*hiddenColumns* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.hiddenColumns
      .hide("column1")
      .show("column2");
    queryTrasformer.transform();

You can pass object of the [Column](~/docs/Column.md) class to hide and show methods as follows.

    column = queryTransformer.columnByName('column1');
    queryTransformer.hide(column);
    queryTransformer.transform();

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
hide | columnName: string | HiddenColumn (self) | Hides column with the specified name from transformed query.
hide | column: [Column](~/docs/Column.md) | HiddenColumn (self) | Hides the specified column from transformed query.
show | columnName: string | HiddenColumn (self) | Cancels hiding of column with the specified name from transformed query.
show | column: [Column](~/docs/Column.md) | HiddenColumn (self) | Cancels hiding of the specified column from transformed query.
clear | - | - | Makes all query columns visible.
getColumns | - | array() string | Returns a copy of hidden column names array.


--------------------------------------------------------------------
## Pagination class
### Description
Helper class of QueryTransformer to work with pagination. Can be accessed via the [QueryTransformer](~/docs/QueryTransformer.md).*pagination* property.

### Properties:
Name         | Type          | Description
------------ | ------------- | ------------- 
skipCount | int | Defines number of rows to skip from the top.
takeCount | int | Defines number of rows to return.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
set | skipCount, takeCount: int | - | Defines number of rows to skip from the top and to return.
clear | -  |  - | Clears both Take and Skip pagination directives.


--------------------------------------------------------------------
## Total class
### Description
Helper class of QueryTransformer to work with totals. Can be accessed via the [QueryTransformer](~/docs/QueryTransformer.md).*totals* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.totals
      .count("id")
      .avg("totalSum");
    queryTrasformer.transform();

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
avg | columnName: string | Total (self) | Adds Average value calculation for a column.
count | columnName: string | Total (self) | Adds row counting calculation for a column.
max | columnName: string | Total (self) | Adds Maximum value calculation for a column.
min | columnName: string | Total (self) | Adds Minimum value calculation for a column.
sum | columnName: string | Total (self) | Adds calculation of the Sum value for a column.
addTotal | columnName: string, func: [aggregateFunctions](~/docs/aggregateFunctions.md) | Total (self) | Adds total calculation for a column with the specified aggregate function. 
removeTotal | columnName: string, func: [aggregateFunctions](~/docs/aggregateFunctions.md) | Total (self) | Removes total calculation for a column with the specified aggregate function. 
add | aggregatedColumn: [AggregatedColumn](~/docs/AggregatedColumn.md) | Total (self) | Adds total calculation with column name and aggregate function defined via the AggregateColumn object.
clear | - | - |  Deletes all totals directives.
getTotals | - | array() [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns a copy of aggregated columns array.


--------------------------------------------------------------------
## Filter class
### Description
Helper class of QueryTransformer to work with conditions. Can be accessed via the [QueryTransformer](~/docs/QueryTransformer.md).*filter* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.filters
      .equal("id", 10)
      .between("dateBefore", ); 

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
equal | columnName: string, value | Filter (self) | Adds new condition for a column to be equal to the specified value.
notEqual | columnName: string, value | Filter (self) | Adds new condition for a column not to be equal to the specified value.
isNull | columnName: string | Filter (self) | Adds new condition for a column to be NULL.
isNotNull | columnName: string | Filter (self) | Adds new condition for a column not to be NULL.
between | columnName: string, fromValue, toValue | Filter (self) | Adds new condition for a column to be included into range between the specified values.
notBetween | columnName: string, fromValue, toValue | Filter (self) | Adds new condition for a column not to be included into range between the specified values.
less | columnName: string, value | Filter (self) | Adds new condition for a column to be less than the specified value.
greater | columnName: string, value | Filter (self) | Adds new condition for a column to be greater than the specified value.
notLess | columnName: string, value | Filter (self) | Adds new condition for a column to be greater or equal than the specified value.
notGreater | columnName: string, value | Filter (self) | Adds new condition for a column to be less or equal than the specified value.
startsWith | columnName: string, value | Filter (self) | Adds new condition for a column to start with the specified value.
notStartWith | columnName: string, value | Filter (self) | Adds new condition for a column not to start with the specified value.
contains | columnName: string, value | Filter (self) | Adds new condition for a column to contain the specified value.
notContain | columnName: string, value | Filter (self) | Adds new condition for a column not to contain the specified value.
endsWith | columnName: string, value | Filter (self) | Adds new condition for a column to end with the specified value.
notEndWith | columnName: string, value | Filter (self) | Adds new condition for a column not to end with the specified value.
isEmpty | columnName: string | Filter (self) | Adds new condition for a column to be an empty string.
isNotEmpty | columnName: string | Filter (self) | Adds new condition for a column not to be an empty string.
addFilter | columnName: string, operator: [conditionalOperators](~/docs/conditionalOperators.md), values: array | Filter (self) | Adds new condition for a column with the specified conditional operator and appropriate values applied to it. 
add | Condition: [FilterCondition](~/docs/FilterCondition.md) | Filter (self) | Adds condition with parameters specified via the Condition object.
add | ConditionGroup: [FilterConditionGroup](~/docs/FilterConditionGroup.md) | Filter (self) | Adds group of conditions. Note that conditions and nested groups in this group must be defined before adding it to the filter. Further modifications will be ignored.
clear | - | - | Deletes all conditions and nested groups.
getFilter | - | [FilterConditionGroup](~/docs/FilterConditionGroup.md) | Returns a copy of filters applied to resultset. The ConditionGroup object contains a set of conditions and a set of nested condition groups.


--------------------------------------------------------------------
## CriteriaBuilder class
### Description
Visual control to define conditions by the end-user.

### Remarks
The control becomes visible after calling the Init method that binds the control to specific HTML element on the page.

    queryTransformer.criteriaBuilder.init("html_element_id");

### Properties:
Name         | Type          | Description
------------ | ------------- | ------------- 
autoApply | boolean | Determines whether the Transform method should be called automatically after each single change in the control.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
init | id | - | Binds the control to HTML element with the specified ID.


--------------------------------------------------------------------
## Column class
### Description
Represents single resultset column.

### Remarks
Calling methods of this object doesn't lead to immediate changing in the query transformer. They return objects which should be applied to appropriate "add" methods of the QueryTransformer.

    column = queryTransformer.columnByName("column1");
    queryTransformer.totals
        .add(column.max())
        .add(column.total(aggregatedColumn.Sum));
    queryTransformer.filters
        .add(column.equal(10))
        .add(column.filter(conditionalOperator.equal, 10);
    queryTransformer.sortings.add(column.ascending());

### Properties:
Name         | Type          | Description
------------ | ------------- | ------------- 
name | string | Name of the column in resultset.
type | string | Data type of the column. 

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
ascending | - | [SortedColumn](~/docs/SortedColumn.md) | Returns new sorting object for Ascending order.
descending | - | [SortedColumn](~/docs/SortedColumn.md) | Returns new sorting object for Descending order.
avg | - | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the Average function.
count | - | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the row counting aggregate function.
max | - | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the Maximum function.
min | - | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the Minimum function.
sum | - | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the Sum function.
total | func: [aggregateFunctions](~/docs/aggregateFunctions.md) | [AggregatedColumn](~/docs/AggregatedColumn.md) | Returns new total value calculation object for the specified aggregate function.
equal | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be equal to the specified value.
notEqual | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to be equal to the specified value.
isNull | - | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be NULL.
isNotNull | - | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to be NULL.
between | fromValue, toValue | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be included into the range between specified values.
notBetween | fromValue, toValue | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to be included into the range between specified values. 
less | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be less than the specified value.
greater | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be greater than the specified value.
notLess | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be greater or equal than the specified value.
notGreater | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be less or equal than the specified value.
startsWith | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to start with the specified value. 
doesntStartWith | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to start with the specified value. 
contains | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to contain the specified value. 
doesntContain | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to contain the specified value.
endsWith | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to end with the specified value. 
doesntEndWith | value | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to end with the specified value. 
isEmpty | - |  [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column to be an empty string.
isNotEmpty | - | [FilterCondition](~/docs/FilterCondition.md) | Returns new condition object for the column not to be an empty string.
filter | operator: [conditionalOperators](~/docs/conditionalOperators.md), values: array | Filter (self) | Returns new condition object for the column with the specified conditional operator and appropriate values applied to it. 


--------------------------------------------------------------------
## AggregatedColumn class
### Description
Represents an aggregation directive to be added to the list of query transformation instuctions.

### Remarks
Use appropriate methods of the [Column](~/docs/Column.md) class to create instances of this class. Pass this object to the **QueryTransformer.Totals.Add** method to apply it to the Query Transformer.

### Properties:
Name         | Type          | Description
------------ | ------------- | ------------- 
name | string | Name of the column in resultset.
func | [aggregateFunctions](~/docs/aggregateFunctions.md) | Aggregate function to be used for total value calculation for this column.


--------------------------------------------------------------------
## SortedColumn class
### Description
Represents an sorting directive to be added to the list of query sorting instuctions.

### Remarks
Use appropriate methods of the [Column](~/docs/Column.md) class to create instances of this class. Pass this object to the **QueryTransformer.Sorting.Add** method to apply it to the Query Transformer.

### Properties:
Name         | Type          | Description
------------ | ------------- | ------------- 
name | string | Name of the column in resultset.
order | [SortDirections](~/docs/SortDirections.md) | Sort direction.


--------------------------------------------------------------------
## FilterCondition class
### Description
Defines single condition for a column.

### Usage sample
    condition = new FilterCondition('column2', conditionalOperators.equal, [10]);

    queryTransformer.filters.add(condition);
    queryTransformer.transform();
    
### Constructor:
Name         | Parameters    | Description
------------ | ------------- | ------------- 
Condition | columnName: string, operator: [ConditionalOperators](~/docs/conditionalOperators.md), values: array | Creates new condition for the specified column with the specified binary operator and values. It's a generic way to create a condition. Alternate way is to use methods of the Column object that return Condition object.


--------------------------------------------------------------------
## FilterConditionGroup class
### Description
Defines group of conditions. It contains a set of single conditions and a set of nested condition groups.

### Usage sample
    conditionGroup = new FilterConditionGroup(junctionTypes.Any);

    // first variant
    column = queryTransformer.columnByName('column1');
    conditionGroup.add( column.contains('some text') );

    // second variant
    conditionGroup.add( new FilterCondition('column2', ConditionalOperators.equal, 10) );

    queryTransformer.filters.add(conditionGroup);
    queryTransformer.transform();

### Constructor:
Name         | Parameters    | Description
------------ | ------------- | ------------- 
ConditionGroup | junctionType: [junctionTypes](~/docs/junctionTypes.md) | Creates new condition group in which all items will be joined with the specified junction type.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | ------------- 
add | condition: [FilterCondition](~/docs/FilterCondition.md) | Adds condition to the group.
add | conditionGroup: [FilterConditionGroup](~/docs/FilterConditionGroup.md) | Adds nested condition group to this group.
clear | - | - | Deletes all conditions and nested condition groups in this group.


--------------------------------------------------------------------
## sortDirections enumeration
### Description
Lists all possible sort directions.

Value | Description
----- | -----------
asc   | Ascending sort order.
desc  | Descending sort order.

--------------------------------------------------------------------
## juctionTypes enumeration
### Description
Lists all possible junction types to be used to join conditions.

Value | Description
----- | -----------
any   | Prescribes to select records that satisfy any of conditions listed in the group. (OR operator)
all   | Prescribes to select records that satisfy all of conditions listed in the group. (AND operator)

--------------------------------------------------------------------
## aggregateFunctions enumeration

### Description
Lists all possible aggregate functions that can be used to calculate totals.

Value | Description
----- | -----------
max  | Maximum aggregate function.
min  | Minimum aggregate function.
avg  | Average aggregate function.
sum  | Sum value aggregate function.
count  | Row counting aggregate function.

--------------------------------------------------------------------
## conditionalOperators enumeration

### Description
Lists all possible conditional operators to be used to build conditions.

Value | Description
----- | -----------
equal | Equality ("=") operator.
notEqual | Inequality ("<>") operator.
isNull  | Positive Null value check. (IS NULL)
isNotNull  | Negative Null value check. (IS NOT NULL)
between  | Range inclusion check (BETWEEN).
notBetween  | Range exclusion check (NOT BETWEEN)
less  | "Lesser" comparison ("<") operator.
greater  | "Greater" comparison (">") operator.
notLess  | "Greater or equal" comparison (">=") operator.
notGreater  | "Less or equal" comparison ("<=") operator.
startsWith  | String starts with value check. (LIKE "value%")
doesntStartWith  | String doesn't start with value check. (NOT LIKE "value%")
contains  | String contains value check. (LIKE "%value%")
doesntContain  | String doesn't contain value check. (NOT LIKE "%value%")
endsWith | String ends with value check. (LIKE "%value")
doesntEndWith  | String doesn't end with value check. (NOT LIKE "%value")
isEmpty  | Positive empty string check. (= '');
isNotEmpty  | Negative empty string check. (<> '');


