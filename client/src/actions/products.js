import {
    PRODUCTS_LOADING,
    PRODUCTS_GET_SUCCESS,
    PRODUCTS_GET_FAILURE,
    CHOOSE_PRODUCTS
} from './types'
import axios from 'axios'

export const getProducts = () => async (dispatch) => {
    dispatch({ type: PRODUCTS_LOADING })
    try {
        const products = await axios.get(
            'https://kv470qnx24.execute-api.us-east-1.amazonaws.com/dev/api/products'
        )

        dispatch({ type: PRODUCTS_GET_SUCCESS, payload: products.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: PRODUCTS_GET_FAILURE, errors: error.message })
    }
}

export const chooseProducts = (data) => ({
    type: CHOOSE_PRODUCTS,
    payload: data
})

export const paginateNext = (hasNextPage, nextCursor) => async (dispatch) => {
    if (!hasNextPage && !nextCursor) {
        return
    }

    dispatch({ type: PRODUCTS_LOADING })

    try {
        const result = await axios({
            method: 'POST',
            url: 'https://kv470qnx24.execute-api.us-east-1.amazonaws.com/dev/api/products/next',
            data: {
                nextCursor
            }
        })

        dispatch({ type: PRODUCTS_GET_SUCCESS, payload: result.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: PRODUCTS_GET_FAILURE, errors: error.message })
    }
}

export const paginatePrevious = (hasPreviousPage, previousCursor) => async (dispatch) => {
    if (!hasPreviousPage && !previousCursor) {
        return
    }

    try {
        const result = await axios({
            method: 'POST',
            url: 'https://kv470qnx24.execute-api.us-east-1.amazonaws.com/dev/api/products/next',
            data: {
                previousCursor
            }
        })

        dispatch({ type: PRODUCTS_GET_SUCCESS, payload: result.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: PRODUCTS_GET_FAILURE, errors: error.message })
    }
}
