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
Condition | columnName: string, operator: [ConditionalOperators](~/docs/ConditionalOperators.md), values: array | Creates new condition for the specified column with the specified binary operator and values. It's a generic way to create a condition. Alternate way is to use methods of the Column object that return Condition object.
