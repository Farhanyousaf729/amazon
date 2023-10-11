import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../comp/Message'
import Loader from '../comp/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/Orderaction'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET ,  ORDER_DETAILS_RESET } from '../constants/orderConstants'

function OrderScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [sdkReady, setSdkReady] = useState(false)
    const { id } = useParams()
    const { loading: laodingPay, success: successPay } = useSelector(state => state.orderPay)
    const { userInfo } = useSelector(state => state.userLogin)
    const { order, loading, error } = useSelector((state) => state.orderDetail)
    
    const { loading: loadingDeliver, success: successDeliver } = useSelector(state => state.orderDeliver)
    // console.log(successDeliver);
    // console.log(order);
    if (!loading  ) {
        //   Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    }
    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        
        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            console.log(`rrrrrrrrrrrrr`);
            dispatch(getOrderDetails(id))
            // dispatch({ type: ORDER_DETAILS_RESET })
        } else if (!window.paypal) {
            
            addPaypalScript()
            
        } else {
            setSdkReady(true)
        }
    }, [dispatch, id, successPay,order , successDeliver])




    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult, 'paymentResult');

        dispatch(payOrder(id, paymentResult))
    }

    const deliverHandler = () => {
     dispatch(deliverOrder(order))
    }

    return loading ? <Loader /> : error ? <Message variant='danger'>

        {error}</Message> : (<>
            <h1>Order {order._id}</h1>

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name :</strong>{order.user?.name}
                            </p>
                            <p>
                                <strong>Email :</strong><a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
                            </p>
                            <p>
                                <strong>Address:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode},{' '}
                                {order.shippingAddress.country}
                            </p>




                            {order.isDelivered ? <Message variant='success'>Delivered On{order.deliveredAt}</Message> :
                                <Message variant='danger'>Not isDelivered</Message>}


                        </ListGroup.Item><ListGroup.Item>

                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant='success'>Paid On{order.paidAt}</Message> :

                                <Message variant='danger'>Not Paid</Message>}
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Order  is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col><Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {laodingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton amount={order.totalPrice.toFixed(2)} onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}


                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>)
}
export default OrderScreen





















