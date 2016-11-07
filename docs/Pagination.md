## Pagination class

### Description
Helper class of QueryTransformer to work with pagination. Can be accessed via the [QueryTransformer](/docs/QueryTransformer.md).*pagination* property.

### Properties:
Name         | Type          | Description
------------ | ------------- | -------------
skipCount | int | Defines number of rows to skip from the top.
takeCount | int | Defines number of rows to return.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | -------------
set | skipCount, takeCount: int | - | Defines number of rows to skip from the top and to return.
clear | -  |  - | Clears both Take and Skip pagination directives.