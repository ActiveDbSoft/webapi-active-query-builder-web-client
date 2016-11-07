## Filter class
### Description
Helper class of QueryTransformer to work with conditions. Can be accessed via the [QueryTransformer](/QueryTransformer.md).*filter* property.

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
addFilter | columnName: string, operator: [conditionalOperators](/ConditionalOperators.md), values: array | Filter (self) | Adds new condition for a column with the specified conditional operator and appropriate values applied to it.
add | Condition: [FilterCondition](/FilterCondition.md) | Filter (self) | Adds condition with parameters specified via the Condition object.
add | ConditionGroup: [FilterConditionGroup](/FilterConditionGroup.md) | Filter (self) | Adds group of conditions. Note that conditions and nested groups in this group must be defined before adding it to the filter. Further modifications will be ignored.
clear | - | - | Deletes all conditions and nested groups.
getFilter | - | [FilterConditionGroup](/FilterConditionGroup.md) | Returns a copy of filters applied to resultset. The ConditionGroup object contains a set of conditions and a set of nested condition groups.
