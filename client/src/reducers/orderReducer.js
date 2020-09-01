import { CREATE_ORDER_LOADING, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE } from '../actions/types'

const initialState = {
    loading: false,
    order: null,
    errors: null
}

export default (state = initialState, action) => {
    const { type, payload, errors } = action
    switch (type) {
        case CREATE_ORDER_LOADING:
            return {
                ...state,
                loading: true
            }
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                order: payload
            }
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                errors: errors
            }
        default:
            return state
    }
}
