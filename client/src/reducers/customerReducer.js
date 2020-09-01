import { GET_CUSTOMER_LOADING, GET_CUSTOMER_SUCCESS, GET_CUSTOMER_FAILURE } from '../actions/types'

const initialState = {
    loading: false,
    customer: null,
    errors: null
}

export default (state = initialState, action) => {
    const { type, payload, errors } = action
    switch (type) {
        case GET_CUSTOMER_LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                loading: false,
                customer: payload
            }
        case GET_CUSTOMER_FAILURE:
            return {
                ...state,
                loading: false,
                errors: errors
            }
        default:
            return state
    }
}
