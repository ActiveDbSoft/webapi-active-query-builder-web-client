## HiddenColumn class
### Description
Helper class of QueryTransformer to show/hide columns. Can be accessed via the [QueryTransformer](/QueryTransformer.md).*hiddenColumns* property.

### Remarks
You can use chaining when calling methods of this class as most of them return 'self', e.g.:

    queryTransformer.hiddenColumns
      .hide("column1")
      .show("column2");
    queryTrasformer.transform();

You can pass object of the [Column](/Column.md) class to hide and show methods as follows.

    column = queryTransformer.columnByName('column1');
    queryTransformer.hide(column);
    queryTransformer.transform();

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | -------------
hide | columnName: string | HiddenColumn (self) | Hides column with the specified name from transformed query.
hide | column: [Column](/Column.md) | HiddenColumn (self) | Hides the specified column from transformed query.
show | columnName: string | HiddenColumn (self) | Cancels hiding of column with the specified name from transformed query.
show | column: [Column](/Column.md) | HiddenColumn (self) | Cancels hiding of the specified column from transformed query.
clear | - | - | Makes all query columns visible.
getColumns | - | array() string | Returns a copy of hidden column names array.