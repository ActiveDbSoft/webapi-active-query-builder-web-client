## conditionalOperators enumeration

### Description
Lists all possible conditional operators to be used to build conditions.

Value | Description
----- | -----------
equal | Equality ("=") operator.
notEqual | Inequality ("<>") operator.
isNull  | Positive Null value check. (IS NULL)
isNotNull  | Negative Null value check. (IS NOT NULL)
between  | Range inclusion check (BETWEEN).
notBetween  | Range exclusion check (NOT BETWEEN)
less  | "Lesser" comparison ("<") operator.
greater  | "Greater" comparison (">") operator.
notLess  | "Greater or equal" comparison (">=") operator.
notGreater  | "Less or equal" comparison ("<=") operator.
startsWith  | String starts with value check. (LIKE "value%")
doesntStartWith  | String doesn't start with value check. (NOT LIKE "value%")
contains  | String contains value check. (LIKE "%value%")
doesntContain  | String doesn't contain value check. (NOT LIKE "%value%")
endsWith | String ends with value check. (LIKE "%value")
doesntEndWith  | String doesn't end with value check. (NOT LIKE "%value")
isEmpty  | Positive empty string check. (= '');
isNotEmpty  | Negative empty string check. (<> '');