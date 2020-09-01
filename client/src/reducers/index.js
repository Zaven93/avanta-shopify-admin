import { combineReducers } from 'redux'
import productsReducer from './productsReducer'
import scanQr from './scanQr'
import customerReducer from './customerReducer'
import orderReducer from './orderReducer'

export default combineReducers({
    productsReducer,
    scanQr,
    customerReducer,
    orderReducer
})
