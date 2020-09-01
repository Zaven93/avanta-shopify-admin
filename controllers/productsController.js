const fetch = require('node-fetch')

module.exports = {
    getProducts: async (req, res) => {
        try {
            const result = await fetch(
                'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': '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'
                    },
                    body: JSON.stringify({
                        query: `{
                        products(first: 7){
                          pageInfo{
                            hasNextPage
                            hasPreviousPage
                          }
                            edges{
                              cursor
                              node{
                                description(truncateAt: 100)
                                id
                                tags
                                title
                                variants(first:1){
                                  edges{
                                    node{
                                      price
                                    }
                                  }
                                }
                                images(first:1){
                                  edges{
                                    node{
                                      originalSrc
                                    }
                                  }
                                }
                              }
                            }
                          }
             }`
                    })
                }
            )
            const products = await result.json()
            res.send(products)
        } catch (error) {
            console.log(error)
        }
    },

    productsNext: async (req, res) => {
        const nextCursor = req.body.nextCursor
        console.log('Next cursor from request', nextCursor)
        try {
            const result = await fetch(
                'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': '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'
                    },
                    body: JSON.stringify({
                        query: `
                  query nextProducts($cursor: String){
                  products(first: 7, after: $cursor){
                    pageInfo{
                      hasNextPage
                      hasPreviousPage
                    }
                      edges{
                        cursor
                        node{
                          description(truncateAt: 100)
                          id
                          tags
                          title
                          variants(first:1){
                            edges{
                              node{
                                price
                              }
                            }
                          }
                          images(first:1){
                            edges{
                              node{
                                originalSrc
                              }
                            }
                          }
                        }
                      }
                    }
                  }`,
                        variables: { cursor: nextCursor }
                    })
                }
            )
            const products = await result.json()
            res.send(products)
        } catch (error) {
            console.log(error)
        }
    },

    productsPrevious: async (req, res) => {
        const previousCursor = req.body.previousCursor
        console.log('Next cursor from request', previousCursor)
        try {
            const result = await fetch(
                'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': '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'
                    },
                    body: JSON.stringify({
                        query: `
                    query previousProducts($cursor: String){
                    products(first: 7, before: $cursor){
                      pageInfo{
                        hasNextPage
                        hasPreviousPage
                      }
                        edges{
                          cursor
                          node{
                            description(truncateAt: 100)
                            id
                            tags
                            title
                            variants(first:1){
                              edges{
                                node{
                                  price
                                }
                              }
                            }
                            images(first:1){
                              edges{
                                node{
                                  originalSrc
                                }
                              }
                            }
                          }
                        }
                      }
                    }`,
                        variables: { cursor: previousCursor }
                    })
                }
            )
            const products = await result.json()
            res.send(products)
        } catch (error) {
            console.log(error)
        }
    }
}
