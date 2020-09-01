import {
    PRODUCTS_LOADING,
    PRODUCTS_GET_SUCCESS,
    PRODUCTS_GET_FAILURE,
    CHOOSE_PRODUCTS
} from '../actions/types'

const initialState = {
    loading: false,
    products: null,
    errors: null,
    customerId: null,
    chosenProducts: []
}

export default (state = initialState, action) => {
    const { type, payload, errors } = action
    switch (type) {
        case PRODUCTS_LOADING:
            return {
                ...state,
                loading: true
            }
        case PRODUCTS_GET_SUCCESS:
            return {
                ...state,
                loading: false,
                products: payload
            }
        case CHOOSE_PRODUCTS:
            return {
                ...state,
                loading: false,
                chosenProducts: [...payload]
            }
        case PRODUCTS_GET_FAILURE:
            return {
                ...state,
                loading: false,
                errors: errors
            }
        default:
            return state
    }
}
