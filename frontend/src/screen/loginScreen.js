
import React, { useState, useEffect } from 'react'

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../comp/Message'
import Loader from '../comp/Loader'
import { Login } from '../actions/Useraction'
import FormContainer from '../comp/FormContainer'


function LoginScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const findLocation = useLocation()
    // console.log(findLocation);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const location = findLocation
    // console.log(location, `search`);
    console.log(findLocation.search);
    const redirect = findLocation.search ? findLocation.search.split('=')[1] : "/"

    // console.log(redirect, `redirect`);

    const { error, loading, userInfo } = useSelector(state => state.userLogin)
    // console.log(userInfo, `userinfo`);

    useEffect(() => {

        if (userInfo) {

            navigate(redirect)
        }

    }, [findLocation , userInfo, redirect]);

    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(Login(email, password))
    }
    return (

        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email">

                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}  ></Form.Control>
                </Form.Group>
                {/* password group */}
                <Form.Group controlId="password">

                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Correct Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}  ></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" >Sign In</Button>
            </Form>

            <Row className="py-3">
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}
export default LoginScreen