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
ConditionGroup | junctionType: [junctionTypes](~/docs/JunctionTypes.md) | Creates new condition group in which all items will be joined with the specified junction type.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | -------------
add | condition: [FilterCondition](~/docs/FilterCondition.md) | Adds condition to the group.
add | conditionGroup: [FilterConditionGroup](~/docs/FilterConditionGroup.md) | Adds nested condition group to this group.
clear | - | - | Deletes all conditions and nested condition groups in this group.
