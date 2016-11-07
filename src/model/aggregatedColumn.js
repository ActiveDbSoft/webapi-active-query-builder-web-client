export default class AggregatedColumn {
    constructor(name, func) {
        this._name = name;
        this._func = func;
    }
    get name() {
        return this._name;
    }
    get func() {
        return this._func;
    }
}