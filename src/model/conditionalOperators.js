const conditionalOperators = {
    isNull: 'IsNull',
    isNotNull: 'IsNotNull',
    isEmpty: 'IsEmpty',
    isNotEmpty: 'IsNotEmpty',
    equal: 'Equal',
    notEqual: 'NotEqual',
    less: 'Less',
    notLess: 'NotLess',
    lessEqual: 'LessEqual',
    notLessEqual: 'NotLessEqual',
    greater: 'Greater',
    notGreater: 'NotGreater',
    greaterEqual: 'GreaterEqual',
    notGreaterEqual: 'NotGreaterEqual',
    between: 'Between',
    notBetween: 'NotBetween',
    contains: 'Contains',
    doesntContain: 'DoesntContain',
    startsWith: 'StartsWith',
    doesNotStartWith: 'DoesntStartWith',
    endsWith: 'EndsWith',
    doesNotEndWith: 'DoesntEndWith'
};

const conditionalOperatorsParams = [
    { name: conditionalOperators.isNull, text: 'is null', forTypes: [ 'number', 'string', 'datetime' ], valueCount: 0 },
    { name: conditionalOperators.isNotNull, text: 'is not null', forTypes: [ 'number', 'string', 'datetime' ], valueCount: 0 },
    { name: conditionalOperators.isEmpty, text: 'is empty', forTypes: [ 'string' ], valueCount: 0 },
    { name: conditionalOperators.isNotEmpty, text: 'is not empty', forTypes: [ 'string' ], valueCount: 0 },
    { name: conditionalOperators.equal, text: 'is equal to', forTypes: [ 'number', 'string', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.notEqual, text: 'is not equal to', forTypes: [ 'number', 'string', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.less, text: 'is less than', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.notLess, text: 'is not less than', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.lessEqual, text: 'is less than or equal to', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.notLessEqual, text: 'is not less than or equal to', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.greater, text: 'is greater than', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.notGreater, text: 'is not greater than', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.greaterEqual, text: 'is greater than or equal to', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.notGreaterEqual, text: 'is not greater than or equal to', forTypes: [ 'number', 'datetime' ], valueCount: 1 },
    { name: conditionalOperators.between, text: 'is beetween', forTypes: [ 'number', 'datetime' ], valueCount: 2 },
    { name: conditionalOperators.notBetween, text: 'is not between', forTypes: [ 'number', 'datetime' ], valueCount: 2 },
    /*{ name: conditionalOperators.in, text: 'is in list', forTypes: [ 'number', 'string', 'datetime' ], valueCount:  },
    { name: conditionalOperators.notIn, text: 'is not in list', forTypes: [ 'number', 'string', 'datetime' ], valueCount:  }, todo in list*/
    { name: conditionalOperators.contains, text: 'contains', forTypes: [ 'string' ], valueCount: 1 },
    { name: conditionalOperators.doesntContain, text: 'does not contain', forTypes: [ 'string' ], valueCount: 1 },
    { name: conditionalOperators.startsWith, text: 'starts with', forTypes: [ 'string' ], valueCount: 1 },
    { name: conditionalOperators.doesNotStartWith, text: 'does not start with', forTypes: [ 'string' ], valueCount: 1 },
    { name: conditionalOperators.endsWith, text: 'ends with', forTypes: [ 'string' ], valueCount: 1 },
    { name: conditionalOperators.doesNotEndWith, text: 'does not end with', forTypes: [ 'string' ], valueCount: 1 }
];

exports.conditionalOperators = conditionalOperators;
exports.conditionalOperatorsParams = conditionalOperatorsParams;