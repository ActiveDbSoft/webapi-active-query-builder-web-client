export function converter(key, value) {
    if(key === 'junctionType')
        return value.toUpperCase();
    if(key === 'order')
        return value.toUpperCase();
    if(key === 'aggregate')
        return value.toUpperCase();
    if(key === 'conditionOperator')
        return value.toUpperCase();
    if(key === 'operator')
        return undefined;
    else if(key === '_id')
        return undefined;
    else if(key === '_order')
        return undefined;
    else if(key === '_parentId')
        return undefined;
    else if(key === '_type')
        return undefined;
    else
        return value;
}