# Order Service API Documentation

## Authentication

All endpoints (except internal verification) require authentication via JWT token.
Pass the token in one of two ways:
- As a cookie named `auth-token`
- As a header named `auth-token`

Internal endpoints require `internal-access-token` header.

## Response Format

All endpoints return responses in the following format:

```json
{
  "success": true|false,
  "message": "Human-readable message",
  // Additional data based on endpoint
}
```

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "details": "..." // Optional additional details
}
```

## Endpoints

### Create a New Order

Creates a new order with the specified items.

- **URL**: `/orders`
- **Method**: `POST`
- **Auth required**: Yes
- **Permissions**: Authenticated user

#### Request Body

```json
{
  "items": [
    {
      "mkt": "30029",
      "name": "Headphones QuietComfort",
      "price": "₪899",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "123 Main St, Tel Aviv, Israel"
  }
}
```

#### Success Response

- **Code**: 201 Created
- **Content example**:

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "60d21b4667d0d8992e610c85",
    "userId": "60d21b4667d0d8992e610c84",
    "items": [
      {
        "mkt": "30029",
        "name": "Headphones QuietComfort",
        "price": "₪899",
        "quantity": 1
      }
    ],
    "totalAmount": 899,
    "status": "pending",
    "shippingAddress": {
      "address": "123 Main St, Tel Aviv, Israel"
    },
    "createdAt": "2023-06-25T12:00:00.000Z",
    "updatedAt": "2023-06-25T12:00:00.000Z"
  }
}
```

#### Error Responses

- **Code**: 400 Bad Request
  - When validation fails or product is out of stock
- **Code**: 401 Unauthorized
  - When authentication token is missing or invalid
- **Code**: 500 Internal Server Error
  - When an unexpected error occurs

---

### Get Order By ID

Retrieves a specific order by its ID.

- **URL**: `/orders/:id`
- **Method**: `GET`
- **URL Params**: 
  - `id`: [string] Order ID
- **Auth required**: Yes
- **Permissions**: Order owner or admin

#### Success Response

- **Code**: 200 OK
- **Content example**:

```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "_id": "60d21b4667d0d8992e610c85",
  "userId": "60d21b4667d0d8992e610c84",
  "items": [
    {
      "mkt": "30029",
      "name": "Headphones QuietComfort",
      "price": "₪899",
      "quantity": 1
    }
  ],
  "totalAmount": 899,
  "status": "pending",
  "shippingAddress": {
    "address": "123 Main St, Tel Aviv, Israel"
  },
  "createdAt": "2023-06-25T12:00:00.000Z",
  "updatedAt": "2023-06-25T12:00:00.000Z"
}
```

#### Error Responses

- **Code**: 401 Unauthorized
  - When authentication token is missing or invalid
- **Code**: 403 Forbidden
  - When user doesn't have permission to view the order
- **Code**: 404 Not Found
  - When order doesn't exist

---

### Get User Orders

Get all orders for the authenticated user.

- **URL**: `/orders/user/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Permissions**: Authenticated user

#### Success Response

- **Code**: 200 OK
- **Content example**:

```json
{
  "success": true,
  "message": "User orders retrieved successfully",
  "orders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "userId": "60d21b4667d0d8992e610c84",
      "items": [
        {
          "mkt": "30029",
          "name": "Headphones QuietComfort",
          "price": "₪899",
          "quantity": 1
        }
      ],
      "totalAmount": 899,
      "status": "pending",
      "shippingAddress": {
        "address": "123 Main St, Tel Aviv, Israel"
      },
      "createdAt": "2023-06-25T12:00:00.000Z",
      "updatedAt": "2023-06-25T12:00:00.000Z"
    }
  ]
}
```

#### Error Responses

- **Code**: 401 Unauthorized
  - When authentication token is missing or invalid

---

### Get All Orders (Admin)

Retrieve all orders with pagination (admin only).

- **URL**: `/orders`
- **Method**: `GET`
- **Query Params**:
  - `page`: [number] Page number (defaults to 1)
  - `limit`: [number] Items per page (defaults to 50)
- **Auth required**: Yes
- **Permissions**: Admin only

#### Success Response

- **Code**: 200 OK
- **Content example**:

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "userId": "60d21b4667d0d8992e610c84",
      "items": [
        {
          "mkt": "30029",
          "name": "Headphones QuietComfort",
          "price": "₪899",
          "quantity": 1
        }
      ],
      "totalAmount": 899,
      "status": "pending",
      "shippingAddress": {
        "address": "123 Main St, Tel Aviv, Israel"
      },
      "createdAt": "2023-06-25T12:00:00.000Z",
      "updatedAt": "2023-06-25T12:00:00.000Z"
    }
    // More orders...
  ],
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

#### Error Responses

- **Code**: 401 Unauthorized
  - When authentication token is missing or invalid
- **Code**: 403 Forbidden
  - When user doesn't have admin permissions

---

### Update Order Status

Update the status of an order (admin only).

- **URL**: `/orders/:id/status`
- **Method**: `PUT`
- **URL Params**:
  - `id`: [string] Order ID
- **Auth required**: Yes
- **Permissions**: Admin only

#### Request Body

```json
{
  "status": "completed"
}
```

Valid status values: `pending`, `processing`, `completed`, `cancelled`

#### Success Response

- **Code**: 200 OK
- **Content example**:

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "60d21b4667d0d8992e610c85",
    "userId": "60d21b4667d0d8992e610c84",
    "status": "completed",
    // Other order details...
  }
}
```

#### Error Responses

- **Code**: 400 Bad Request
  - When status is invalid
- **Code**: 401 Unauthorized
  - When authentication token is missing or invalid
- **Code**: 403 Forbidden
  - When user doesn't have admin permissions
- **Code**: 404 Not Found
  - When order doesn't exist

---

### Verify Order Exists (Internal)

Verify if an order exists (for use by other services).

- **URL**: `/orders/internal/verify-order`
- **Method**: `POST`
- **Auth required**: Internal token
- **Permissions**: Internal services only

#### Request Body

```json
{
  "orderId": "60d21b4667d0d8992e610c85"
}
```

#### Success Response

- **Code**: 200 OK
- **Content example**:

```json
{
  "success": true,
  "message": "Order exists",
  "exists": true,
  "orderId": "60d21b4667d0d8992e610c85",
  "status": "pending"
}
```

#### Error Responses

- **Code**: 400 Bad Request
  - When orderId is missing
- **Code**: 403 Forbidden
  - When internal token is missing or invalid
- **Code**: 404 Not Found
  - When order doesn't exist
  - **Content example**:
    ```json
    {
      "success": false,
      "message": "Order not found",
      "details": {
        "exists": false
      }
    }
    ```