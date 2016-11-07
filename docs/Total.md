## Total class
### Description
Helper class of QueryTransformer to work with totals. Can be accessed via the [QueryTransformer](/QueryTransformer.md).*totals* property.

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
addTotal | columnName: string, func: [aggregateFunctions](/AggregateFunctions.md) | Total (self) | Adds total calculation for a column with the specified aggregate function.
removeTotal | columnName: string, func: [aggregateFunctions](/AggregateFunctions.md) | Total (self) | Removes total calculation for a column with the specified aggregate function.
add | aggregatedColumn: [AggregatedColumn](/AggregatedColumn.md) | Total (self) | Adds total calculation with column name and aggregate function defined via the AggregateColumn object.
clear | - | - |  Deletes all totals directives.
getTotals | - | array() [AggregatedColumn](/AggregatedColumn.md) | Returns a copy of aggregated columns array.