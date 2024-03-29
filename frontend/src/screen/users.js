import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../comp/Message'
import Loader from "../comp/Loader"
import { useNavigate } from "react-router-dom"
import { deleteUser } from "../actions/Useraction"
import { listUsers } from '../actions/Useraction'
function UserListScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, users } = useSelector(state => state.userList)
    const { loading: loadingDelete, error: errorDelete, success } = useSelector(state => state.userDelete)
    const { userInfo } = useSelector(state => state.userLogin)
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {

            dispatch(listUsers())
        }
        else {
            navigate('/login')
        }
    }, [dispatch , success])
    const deleteHandler = (id) => {
        // console.log("Delete user");
        console.log(id);
        dispatch(deleteUser(id))
        // if(success){
        //     dispatch(listUsers())
        // }
    }

    
    return (
        <>
            <h1>Users</h1>
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) :
              loadingDelete ? (<Loader />) : errorDelete ? (<Message variant='danger'>{errorDelete}</Message>) : 


                (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                    </td>
                                    <td>
                                        {user.isAdmin ? (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(user._id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </>
    )
}


export default UserListScreen


