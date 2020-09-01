import { SCAN_QR } from '../actions/types'

const initialState = {
    customerId: null
}

export default (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case SCAN_QR:
            return {
                customerId: payload
            }
        default:
            return state
    }
}
