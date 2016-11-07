## Sorting class
### Description
Helper class of QueryTransformer to work with sortings. Can be accessed via the [QueryTransformer](/docs/QueryTransformer.md).*sortings* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.sortings
      .orderBy("column1", SortDirections.asc)
      .orderBy("column2", SortDirections.desc);
    queryTrasformer.transform();

### Methods:
Name        | Parameters     | Return value  | Description
------------ | ------------- | ------------- | -------------
orderBy | columnName: string, order: [SortDirections](/docs/SortDirections.md) | Sorting (self) | Sets sort order for a column. If several columns are involded in sorting data, the *order* parameter determines priority among the other sorted columns.
removeOrderBy | columnName: string | Sorting (self) | Removes the specified column from the list of sortings.
add | sortedColumn: [SortedColumn](/docs/SortedColumn.md) | Sorting (self) | Adds SortedColumn object to the list of sorted columns.
clear | - | - | Deletes all sorting directives.
getSortings | - | array() [SortedColumn](/docs/SortedColumn.md) | Returns a copy of sorted columns array.