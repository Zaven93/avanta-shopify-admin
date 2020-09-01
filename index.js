const dotenv = require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const cookie = require('cookie')
const nonce = require('nonce')()
const querystring = require('query-string')
const axios = require('axios')
const fetch = require('node-fetch')
const productsRoute = require('./routes/productsRoute')

const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY
const scopes =
    'write_products, read_products, read_customers, write_customers, read_draft_orders, write_draft_orders, read_orders, write_orders'
const appUrl = 'https://a4f3308a5a4e.ngrok.io'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/products', productsRoute)

app.get('/', (req, res) => {
    res.send('Avanta Transactions')
})

const buildRedirectUri = () => `${appUrl}/shopify/callback`

const buildInstallUrl = (shop, state, redirectUri) =>
    `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`

const buildAccessTokenRequestUrl = (shop) => `https://${shop}/admin/oauth/access_token`

const buildShopDataRequestUrl = (shop) => `https://${shop}/admin/shop.json`

const generateEncryptedHash = (privateKey, params) => {
    const key = CryptoJS.enc.Utf8.parse(privateKey)
    const Params = CryptoJS.enc.Utf8.parse(params)
    const hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(Params, key))

    return hmac
}

const fetchAccessToken = async (shop, data) =>
    await axios(buildAccessTokenRequestUrl(shop), {
        method: 'POST',
        data
    })

const fetchShopData = async (shop, accessToken) =>
    await axios(buildShopDataRequestUrl(shop), {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    })

app.get('/shopify', (req, res) => {
    const shop = req.query.shop

    if (!shop) {
        return res.status(400).send('no shop')
    }

    const state = nonce()

    const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri())

    res.cookie('state', state) // should be encrypted in production
    res.redirect(installShopUrl)
})

app.get('/shopify/callback', async (req, res) => {
    const { shop, code, state } = req.query
    const stateCookie = cookie.parse(req.headers.cookie).state

    if (state !== stateCookie) {
        return res.status(403).send('Cannot be verified')
    }

    const { hmac, ...params } = req.query
    const queryParams = querystring.stringify(params)
    const hash = generateEncryptedHash(shopifyApiSecretKey, queryParams)

    if (hash !== hmac) {
        return res.status(400).send('HMAC validation failed')
    }

    try {
        const data = {
            client_id: shopifyApiPublicKey,
            client_secret: shopifyApiSecretKey,
            code
        }
        const tokenResponse = await fetchAccessToken(shop, data)

        const { access_token } = tokenResponse.data

        const shopData = await fetchShopData(shop, access_token)
        res.send(shopData.data.shop)
        console.log('Here is the token Zaven', access_token)
    } catch (err) {
        console.log(err)
        res.status(500).send('something went wrong')
    }
})

app.get('/greeting', (req, res) => {
    res.send('Hello Zaven')
})

app.get('/shop-info', (req, res) => {
    fetch('https://transactions-avanta.myshopify.com/admin/api/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': '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'
        },
        body: JSON.stringify({
            query: `{
         shop {
           name
           url
           email
           myshopifyDomain
         }
       }`
        })
    })
        .then((result) => {
            return result.json()
        })
        .then((data) => {
            console.log('data returned:\n', data)
            res.send(data)
        })
})

app.get('/customers', (req, res) => {
    fetch('https://transactions-avanta.myshopify.com/admin/api/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': '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'
        },
        body: JSON.stringify({
            query: `{
            customers(first: 5){
              edges{
                node{
                  lastName
                  firstName
                  email
                }
              }
            }
     }`
        })
    })
        .then((result) => {
            return result.json()
        })
        .then((data) => {
            console.log('data returned:\n', data)
            res.send(data)
        })
})

app.get('/customer/:id', (req, res) => {
    fetch('https://transactions-avanta.myshopify.com/admin/api/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': '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'
        },
        body: JSON.stringify({
            query: `
              query Customer($id: ID!){
              customer(id: $id){
                firstName
                lastName
                email
                id
                image(size: 100){
                  originalSrc
                }
              }
            }
          `,
            variables: { id: `gid://shopify/Customer/${req.params.id}` }
        })
    })
        .then((result) => {
            return result.json()
        })
        .then((data) => {
            console.log('data returned:\n', data)
            res.send(data)
        })
})

app.post('/order', async (req, res) => {
    try {
        const orderRes = await fetch(
            'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': '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'
                },
                body: JSON.stringify({
                    query: `
          mutation CreateOrder($input: DraftOrderInput!){
            draftOrderCreate(input: $input){
              draftOrder {
                id
                customer {
                  id
                }
                email
                lineItems(first: 10){
                  edges{
                    node{
                      title
                      quantity
                      originalUnitPrice
                    }
                  }
                }
              }
            }
          }

        `,
                    variables: {
                        input: {
                            customerId: `gid://shopify/Customer/${req.body.customerId}`,
                            taxExempt: true,
                            lineItems: req.body.products
                        }
                    }
                })
            }
        )

        const order = await orderRes.json()

        const sendCompleteOrder = await fetch(
            'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': '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'
                },
                body: JSON.stringify({
                    query: `
                    mutation CompleteOrder($id: ID!){
                    draftOrderComplete(id: $id, paymentPending:true){
                        draftOrder{
                          customer {
                            id
                          }
                          email
                          name
                        }
                      }
                    }
        `,
                    variables: {
                        id: order.data.draftOrderCreate.draftOrder.id
                    }
                })
            }
        )
        const completeOrder = await sendCompleteOrder.json()
        res.send(completeOrder)
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
