## CriteriaBuilder class
### Description
Visual control to define conditions by the end-user.

### Remarks
The control becomes visible after calling the Init method that binds the control to specific HTML element on the page.

    queryTransformer.criteriaBuilder.init("html_element_id");

### Properties:
Name         | Type          | Description
------------ | ------------- | -------------
autoApply | boolean | Determines whether the Transform method should be called automatically after each single change in the control.

### Methods:
Name         | Parameters    | Return value  | Description
------------ | ------------- | ------------- | -------------
init | id | - | Binds the control to HTML element with the specified ID.