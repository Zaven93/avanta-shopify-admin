import { GET_CUSTOMER_LOADING, GET_CUSTOMER_SUCCESS, GET_CUSTOMER_FAILURE } from './types'
import axios from 'axios'

export const getCustomer = (customerId) => async (dispatch) => {
    dispatch({ type: GET_CUSTOMER_LOADING })
    try {
        const customer = await axios.get(
            `https://kv470qnx24.execute-api.us-east-1.amazonaws.com/dev/api/customer/${customerId}`
        )
        dispatch({ type: GET_CUSTOMER_SUCCESS, payload: customer.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: GET_CUSTOMER_FAILURE, errors: error.message })
    }
}
