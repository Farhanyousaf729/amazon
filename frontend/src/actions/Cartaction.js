
import { CART_ADD_ITEM, CART_REMOVE_ITEM  , CART_SAVE_SHIPPING_ADDRESS , CART_SAVE_PAYMENT_METHOD} from "../constants/cartConstants"
import axios from "axios"

export const removeFromCart = (id) => (dispath, getState) => {

    dispath({ type: CART_REMOVE_ITEM, payload: id })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)
    // console.log(`${id} ${qty}`);
    dispatch({
        type: CART_ADD_ITEM, payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        },
    })
    // console.log(getState().cart.cartItems);
    {

        qty !==0 && localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))  
    }
}


export const saveShippingAddress =(data) => (dispatch ) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload:data
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}



export const savePaymentMethod =(data) => (dispatch ) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload:data
    })
    localStorage.setItem('paymentMethod', JSON.stringify(data))
}