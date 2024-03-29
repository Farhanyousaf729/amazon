import React from 'react'
import {Card} from 'react-bootstrap'
import Rating from "./rating"
import { Link} from "react-router-dom"
function Product({product}) {
  return (
   <Card>
        <a href={`/product/${product._id}`}>
            <Card.Img src={product.image} varient="top" />
        </a>

        <Card.Body>

            <a href={`/product/${product._id}`}>

                <Card.Title as='div'>
                    <strong>
                        {product.name}
                    </strong>
                </Card.Title>
            </a>

            <Card.Text as='div'>
                  <div className='my-3'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                  </div>
            </Card.Text>



             <Card.Text as='h3'>
                {product.price}
            </Card.Text>

        </Card.Body>

    </Card>
  )
}

export default Product