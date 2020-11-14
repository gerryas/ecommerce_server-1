# ecommerce_server
E-commerce App is an application for user to display and/or sell their product. This app has : 
* Error case response
* RESTful endpoint for product's CRUD operation
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

> Get all categories and products

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
          "CategoryId: number
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
          "CategoryId: number
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