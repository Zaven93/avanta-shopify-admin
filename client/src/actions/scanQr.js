import { SCAN_QR } from './types'

export const scanQr = (data) => ({
    type: SCAN_QR,
    payload: data
})
