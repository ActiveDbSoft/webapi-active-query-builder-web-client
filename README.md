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

--------------------------------------------------------------------

### Enumerations
Enumeration | Description
----------- | -----------
[junctionTypes](~/docs/JunctionTypes.md) | Lists all possible junction types to be used to join conditions.
[aggregateFunctions](~/docs/AggregateFunctions.md) | Lists all possible aggregate functions that can be used to calculate totals.
[conditionalOperators](~/docs/ConditionalOperators.md) | Lists all possible conditional operators to be used to build conditions.
[sortDirections](~/docs/SortDirections.md) | Lists all possible sort directions.


