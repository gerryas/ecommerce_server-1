# ecommerce_server
E-commerce App is an application for user to display and/or sell their product. This app has : 
* Error case response
* RESTful endpoint for product's and banner's CRUD operation
* JSON formatted response

&nbsp;

## Errors

| Code  | Name                  | Message                                            |
| ----- | --------------------- | -------------------------------------------------- |
| 400   | Bad Request           | < Validation error > or Invalid Email or Password  |
| 401   | Unauthorized          | Authentication Failed                              |
| 403   | Forbidden             | Not Authorized                                     |
| 404   | Not Found             | Error not found                                    |
| 500   | Internal Server Error | Internal server error                              |

_Response_
```
{
  "error": "error message here"
}
```

## RESTful endpoints

### POST /login

> Create access token based on user login data

_Request Headers_
```
not needed
```

_Parameters_
```
not needed
```

_Request Body_
```
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_
```
{
  "access_token": "string",
  "name": "string"
  "email": "string",
  "avatar": "string",
  "role": "string" 
}
```

### GET /categories

> Get all categories includes its products and banners

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Parameters_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 -OK)_
```
[
  {
    "id": number,
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "Products": [
        {
          "id": number,
          "name": "string",
          "image_url": "string",
          "price": "string"
          "stock": "string"
          "CategoryId: number,
          "createdAt": "string",
          "updatedAt": "string",
        },
        { ... },
        { ... }
    ],
    "Banners": [
        {
          "id": number,
          "title": "string",
          "image_url": "string",
          "status": boolean,
          "CategoryId: number,
          "createdAt": "string",
          "updatedAt": "string",
        },
        { ... },
        { ... }
    ]
  },
  {
    "id": number,
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "Products": [
        {
          "id": number,
          "name": "string",
          "image_url": "string",
          "price": "string"
          "stock": "string"
          "CategoryId: number,
          "createdAt": "string",
          "updatedAt": "string",
        },
        { ... },
        { ... }
    ],
    "Banners": [
        {
          "id": number,
          "title": "string",
          "image_url": "string",
          "status": boolean,
          "CategoryId: number,
          "createdAt": "string",
          "updatedAt": "string",
        },
        { ... },
        { ... }
    ]
  },
  { ... },
  { ... }
]
```

### POST /products

> Create new product

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Parameters_
```
not needed
```

_Request Body_
```
{
  "name": "string",
  "image_url": "string",
  "price": number,
  "stock": number,
  "category": "string"
}
```

_Response (200)_
```
{
  "id": number,
  "name": "string",
  "image_url": "string",
  "price": number,
  "stock": number,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### GET /products

> Get all products

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
[
  {
    "id": number,
    "name": "string",
    "image_url": "string",
    "price": number,
    "stock": number,
    "CategoryId": number,
    "createdAt": "string",
    "updatedAt": "string"
  },
  {
    "id": number,
    "name": "string",
    "image_url": "string",
    "price": number,
    "stock": number,
    "CategoryId": number,
    "createdAt": "string",
    "updatedAt": "string"
  },
  {...},
  {...}
]

```

### GET /products/:productId

> Get spesific product

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "productId": number
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "id": number,
  "name": "string",
  "image_url": "string",
  "price": number,
  "stock": number,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /products/:productId

> Update product. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "productId": number,
}
```

_Request Body_
```
{
  "name": "string",
  "image_url": "string",
  "price": number,
  "stock": number,
  "category": "string"
}
```

_Response (200 - OK)_
```
{
  "id": number,
  "name": "string",
  "image_url": "string",
  "price": number,
  "stock": number,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /products/:productId

> Delete product. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "productId": number,
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "msg": "Product deleted",
}
```

### POST /banners

> Create new banner

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Parameters_
```
not needed
```

_Request Body_
```
{
  "name": "string",
  "image_url": "string",
  "status": boolean,
  "category": "string"
}
```

_Response (200)_
```
{
  "id": number,
  "title": "string",
  "image_url": "string",
  "status": boolean,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### GET /banners

> Get all banners

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
[
  {
    "id": number,
    "title": "string",
    "image_url": "string",
    "status": boolean,
    "CategoryId": number,
    "createdAt": "string",
    "updatedAt": "string"
  },
  {
    "id": number,
    "title": "string",
    "image_url": "string",
    "status": boolean,
    "CategoryId": number,
    "createdAt": "string",
    "updatedAt": "string"
  },
  {...},
  {...}
]

```

### GET /banners/:bannerId

> Get spesific banner

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "bannerId": number
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "id": number,
  "title": "string",
  "image_url": "string",
  "status": boolean,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /banners/:bannerId

> Update banner. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "bannerId": number,
}
```

_Request Body_
```
{
  "name": "string",
  "image_url": "string",
  "status": boolean,
  "category": "string"
}
```

_Response (200 - OK)_
```
{
  "id": number,
  "title": "string",
  "image_url": "string",
  "status": boolean,
  "CategoryId": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /banners/:bannerId

> Delete banner. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "bannerId": number,
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "msg": "Banner deleted",
}
```

### GET /cart

> Get all user's cart

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
  {
    "id": number,
    "name": "string",
    "email": "string",
    "avatar": number,
    "createdAt": "string",
    "updatedAt": "string",
    "Products": [
      {
        "id": number,
        "name": "string",
        "image_url": "string",
        "price": number,
        "stock": number,
        "CategoryId": number,
        "createdAt": "string",
        "updatedAt": "string",
        "Cart": {
          "UserId": number,
          "ProductId": number,
          "amount": number,
          "createdAt": "string",
          "updatedAt": "string",
        }
      },
      { ... },
      { ... }
    ]
  }
```

### POST /carts

> Create new banner

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Parameters_
```
not needed
```

_Request Body_
```
{
  "ProductId": number
}
```

_Response (200 OR 201)_
```
{
  "UserId": number,
  "ProductId": number,
  "amount": number,
  "status": boolean,
  "id": number,
  "createdAt": "string",
  "updatedAt": "string",
}
```

### PATCH /carts/:id

> Update cart amount. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "id": number,
}
```

_Request Body_
```
{
  "amount": number
}
```

_Response (200 - OK)_
```
{
  "UserId": number,
  "ProductId": number,
  "amount": number,
  "status": boolean,
  "id": number,
  "createdAt": "string",
  "updatedAt": "string",
}
```

### DELETE /carts/:id

> Delete cart. 

_Request Headers_
```
{
  "accessToken": "string"
}
```

_Path Parameters_
```
{
  "id": number,
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "msg": "Cart deleted",
}
```
