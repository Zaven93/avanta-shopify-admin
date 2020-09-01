import { CREATE_ORDER_LOADING, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE } from './types'
import axios from 'axios'

export const createOrder = (data) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_LOADING })
    try {
        const order = await axios({
            method: 'POST',
            url: 'https://kv470qnx24.execute-api.us-east-1.amazonaws.com/dev/api/order',
            data: data
        })

        dispatch({ type: CREATE_ORDER_SUCCESS, payload: order.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: CREATE_ORDER_FAILURE, errors: error.message })
    }
}
