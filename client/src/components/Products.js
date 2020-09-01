import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Thumbnail,
    Checkbox,
    TextStyle,
    Button,
    Modal,
    TextContainer,
    Pagination,
    TextField
} from '@shopify/polaris'
import { SearchMinor } from '@shopify/polaris-icons'
import QrScanner from 'react-qr-scanner'
import { Table, Header, Icon } from 'semantic-ui-react'
import { getProducts, chooseProducts, paginateNext, paginatePrevious } from '../actions/products'
import { scanQr } from '../actions/scanQr'
import { toCurrency } from '../utils/helper'

const Products = ({ history }) => {
    const dispatch = useDispatch()
    const { loading, products, errors } = useSelector((state) => state.productsReducer)
    const { customerId } = useSelector((state) => state.scanQr)
    const [rowId, setRowId] = useState([])
    const [state, setState] = useState({
        products: []
    })
    const [active, setActive] = useState(false)
    const [searchValue, setSearchValue] = useState(null)
    const handleSearchInput = useCallback((newValue) => setSearchValue(newValue), [])

    const handleChange = useCallback(() => setActive(!active), [active])
    const handleScan = (data) => {
        dispatch(scanQr(data))
    }
    const handleError = (error) => {
        console.log(error)
    }
    if (customerId !== null) {
        setTimeout(() => {
            dispatch(chooseProducts(state.products))
            history.push('/customer')
        }, 500)
    }

    useEffect(() => {
        if (products) {
            return
        }
        dispatch(getProducts())
    }, [dispatch])

    if (loading) {
        return (
            <span role="img" aria-label="Loading">
                Loading ✨
            </span>
        )
    }

    if (errors) {
        return <div>Sorry something went wrong. Check back soon.</div>
    }

    const previewStyle = {
        height: 500,
        width: '100%'
    }

    const paginateNextPage = () => {
        const nextCursor =
            products.data.products.edges[products.data.products.edges.length - 1].cursor
        const hasNextPage = products.data.products.pageInfo.hasNextPage

        console.log('Next Cursor', nextCursor)
        console.log('Has next Page', hasNextPage)

        return dispatch(paginateNext(hasNextPage, nextCursor))
    }

    const paginatePreviousPage = () => {
        const previousCursor = products.data.products.edges[0].cursor
        const hasPreviousPage = products.data.products.pageInfo.hasPreviousPage

        return dispatch(paginatePrevious(hasPreviousPage, previousCursor))
    }

    return (
        <div className="App">
            <TextField
                label="Search Product"
                value={searchValue}
                onChange={handleSearchInput}
                prefix={<Icon name="search" />}
            />
            ;
            <Table celled striped selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Products</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {products &&
                        products.data.products.edges
                            .filter((product) => {
                                if (searchValue == null) {
                                    return product
                                } else if (
                                    product.node.title
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase())
                                ) {
                                    return product
                                }
                            })
                            .map((product) => (
                                <Table.Row
                                    key={product.node.id}
                                    onClick={() => {
                                        if (rowId.includes(product.node.id)) {
                                            setRowId(rowId.filter((id) => id !== product.node.id))
                                            setState({
                                                products: state.products.filter(
                                                    (filteredProduct) =>
                                                        filteredProduct.node.id !== product.node.id
                                                )
                                            })
                                        } else {
                                            setRowId([...rowId, product.node.id])
                                            setState({ products: [...state.products, product] })
                                        }
                                    }}>
                                    <Table.Cell>
                                        <Header as="h4" image className="product-header">
                                            <Checkbox
                                                checked={rowId.includes(product.node.id) && true}
                                            />
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
                                </Table.Row>
                            ))}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell>
                            {products && (
                                <Pagination
                                    hasPrevious={products.data.products.pageInfo.hasPreviousPage}
                                    onPrevious={paginatePreviousPage}
                                    hasNext={products.data.products.pageInfo.hasNextPage}
                                    onNext={paginateNextPage}
                                />
                            )}
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                        <Table.HeaderCell>
                            <Button
                                disabled={state.products.length === 0}
                                primary
                                onClick={handleChange}>
                                <Icon name="expand" /> Scan QR
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            <div>
                <Modal open={active} onClose={handleChange} title="Scan QR Code">
                    <Modal.Section>
                        <TextContainer>
                            <QrScanner
                                style={previewStyle}
                                onError={handleError}
                                onScan={handleScan}
                            />
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </div>
        </div>
    )
}

export default Products
