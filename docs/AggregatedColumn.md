## AggregatedColumn class
### Description
Represents an aggregation directive to be added to the list of query transformation instuctions.

### Remarks
Use appropriate methods of the [Column](/docs/Column.md) class to create instances of this class. Pass this object to the **QueryTransformer.Totals.Add** method to apply it to the Query Transformer.

### Properties:
Name         | Type          | Description
------------ | ------------- | -------------
name | string | Name of the column in resultset.
func | [aggregateFunctions](/docs/AggregateFunctions.md) | Aggregate function to be used for total value calculation for this column.
