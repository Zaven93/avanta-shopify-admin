import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useState, useSelector } from 'react-redux'
import { Avatar, Card, DataTable, Page, Button, Thumbnail, TextStyle } from '@shopify/polaris'
import { Table, Header } from 'semantic-ui-react'
import { toCurrency } from '../utils/helper'
import { getCustomer } from '../actions/customer'
import { createOrder } from '../actions/order'
import productsReducer from '../reducers/productsReducer'
import { createStore } from 'redux'

const Customer = ({ history }) => {
    const { customerId } = useSelector((state) => state.scanQr)
    const customer = useSelector(
        (state) => state.customerReducer.customer && state.customerReducer.customer.data.customer
    )
    const { chosenProducts } = useSelector((state) => state.productsReducer)
    const dispatch = useDispatch()

    const sendOrder = async () => {
        const data = {
            customerId,
            products: chosenProducts.map((product) => ({
                quantity: 1,
                title: product.node.title,
                originalUnitPrice: Number(product.node.variants.edges[0].node.price)
            }))
        }

        await dispatch(createOrder(data))

        history.push('/orders')
        return
    }

    console.log('Chosen products from redux', chosenProducts)

    useEffect(() => {
        dispatch(getCustomer(customerId))
    }, [])

    const totalBonusAmmount = () => {
        const prices = chosenProducts.map(
            (product) =>
                (Number(product.node.variants.edges[0].node.price) *
                    Number(product.node.tags[0].split('')[0])) /
                100
        )

        return prices.reduce((total, currentValue) => total + currentValue, 0)
    }

    const productsTotalPrice = () => {
        const prices = chosenProducts.map((product) =>
            Number(product.node.variants.edges[0].node.price)
        )

        return prices.reduce((total, currentValue) => total + currentValue, 0)
    }

    console.log('total Ammount', totalBonusAmmount())

    return (
        customer && (
            <Card title="Customer">
                <Card.Section>
                    <Avatar customer source={customer.image.originalSrc} />
                    <p>
                        {customer.firstName} {customer.lastName}
                    </p>
                </Card.Section>
                <Card.Section title="Contact Information">
                    <p>{customer.email}</p>
                </Card.Section>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Products</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                            <Table.HeaderCell>Bonus percentage</Table.HeaderCell>
                            <Table.HeaderCell>Bonus ammount</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {chosenProducts &&
                            chosenProducts.map((product) => (
                                <Table.Row key={product.node.id}>
                                    <Table.Cell>
                                        <Header as="h4" image className="product-header">
                                            <Thumbnail
                                                source={
                                                    product.node.images.edges[0] &&
                                                    product.node.images.edges[0].node.originalSrc
                                                }
                                                size="small"
                                                alt=""
                                            />
                                            <Header.Content>{product.node.title}</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <TextStyle variation="subdued">
                                            {product.node.description}
                                        </TextStyle>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <TextStyle variation="subdued">
                                            {product.node.variants.edges[0] &&
                                                toCurrency(
                                                    product.node.variants.edges[0].node.price
                                                )}
                                        </TextStyle>
                                    </Table.Cell>
                                    <Table.Cell>{product.node.tags[0]}</Table.Cell>
                                    <Table.Cell>
                                        {toCurrency(
                                            (Number(product.node.variants.edges[0].node.price) *
                                                Number(product.node.tags[0].split('')[0])) /
                                                100
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell>
                                Total Products Price: {toCurrency(productsTotalPrice())}
                            </Table.HeaderCell>
                            <Table.HeaderCell />
                            <Table.HeaderCell>
                                Total Bonus Ammount: {toCurrency(totalBonusAmmount())}
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell>
                                <Button primary onClick={sendOrder}>
                                    Confirm
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Card>
        )
    )
}

export default Customer
