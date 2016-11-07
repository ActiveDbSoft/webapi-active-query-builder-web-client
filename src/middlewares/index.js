import { applyMiddleware } from 'redux';
import getColumns from './getColumns'
import transform from './transform'

export default () => applyMiddleware(getColumns, transform);