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
ascending | - | [SortedColumn](/SortedColumn.md) | Returns new sorting object for Ascending order.
descending | - | [SortedColumn](/SortedColumn.md) | Returns new sorting object for Descending order.
avg | - | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the Average function.
count | - | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the row counting aggregate function.
max | - | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the Maximum function.
min | - | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the Minimum function.
sum | - | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the Sum function.
total | func: [aggregateFunctions](/AggregateFunctions.md) | [AggregatedColumn](/AggregatedColumn.md) | Returns new total value calculation object for the specified aggregate function.
equal | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be equal to the specified value.
notEqual | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to be equal to the specified value.
isNull | - | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be NULL.
isNotNull | - | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to be NULL.
between | fromValue, toValue | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be included into the range between specified values.
notBetween | fromValue, toValue | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to be included into the range between specified values.
less | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be less than the specified value.
greater | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be greater than the specified value.
notLess | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be greater or equal than the specified value.
notGreater | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be less or equal than the specified value.
startsWith | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to start with the specified value.
doesntStartWith | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to start with the specified value.
contains | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to contain the specified value.
doesntContain | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to contain the specified value.
endsWith | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to end with the specified value.
doesntEndWith | value | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to end with the specified value.
isEmpty | - |  [FilterCondition](/FilterCondition.md) | Returns new condition object for the column to be an empty string.
isNotEmpty | - | [FilterCondition](/FilterCondition.md) | Returns new condition object for the column not to be an empty string.
filter | operator: [conditionalOperators](/ConditionalOperators.md), values: array | Filter (self) | Returns new condition object for the column with the specified conditional operator and appropriate values applied to it.
