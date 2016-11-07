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
