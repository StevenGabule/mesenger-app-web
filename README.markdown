# GraphQL Real-Time Chat

This repository contains the backend for a simple, real-time chat application built using GraphQL, showcasing its capabilities for modern application development.

[![Watch the Demo](assets/loom-video-demo.png)](https://www.loom.com/share/1c786d4aeefb4634a5daaba1d8bedcf4?sid=4b5b3572-c79f-4ccb-ba4e-f49cd446ef76)

## Live Endpoint
The server is available at:  
[http://178.128.61.160:4000/graphql](http://178.128.61.160:4000/graphql)

## Core Features
- **User Authentication**: Users can sign up and log in to their accounts.
- **Direct Messaging**: Authenticated users can send messages to other registered users.
- **Message Retrieval**: Fetch conversation history with another user.
- **Real-Time Updates**: Receive messages in real-time without refreshing the app.

## Tech Choices & Implementation Decisions

### Why GraphQL?
GraphQL was chosen over a traditional REST API for the following reasons:
- **Single Endpoint**: A single `/graphql` endpoint simplifies data operations for both backend and clients.
- **No Over-fetching**: Clients can request only the required data, e.g., participant names and last messages.
- **Built-in Real-Time**: GraphQL Subscriptions provide an elegant solution for real-time events, ideal for chat applications.

The backend uses **Apollo Server**, the industry-standard tool for building robust GraphQL servers in Node.js.

### Real-Time with Subscriptions
Real-time message delivery is implemented using **GraphQL Subscriptions** over WebSockets. When a user sends a message via the `sendMessage` mutation, the event is published, and subscribed clients receive the data instantly.

### In-Memory Data (For Simplicity)
For this proof-of-concept, data (users and messages) is stored in an in-memory array to keep setup simple and avoid database configuration overhead.  
**Note**: Data is wiped on server restart. For production, replace with a persistent database like PostgreSQL or MongoDB.

## How to Use the API
Interact with the API using any GraphQL client (e.g., Postman, Insomnia) at [http://178.128.61.160:4000/graphql](http://178.128.61.160:4000/graphql).

### 1. Signup
Create a new user account.

```graphql
mutation Signup {
  signup(input: {username: "testuser", email: "test@example.com", password: "password123"}) {
    token
    user {
      id
      username
    }
  }
}
```

### 2. Login
Log in and receive a JWT token for authenticated requests.

```graphql
mutation Login {
  login(input: {email: "test@example.com", password: "password123"}) {
    token
    user {
      id
    }
  }
}
```

**Note**: Include the token in HTTP headers for authenticated requests:  
`{ "Authorization": "Bearer <your_token>" }`

### 3. Send a Message
Send a message to another user (identified by their ID).

```graphql
mutation SendMessage {
  sendMessage(input: {recipientId: "user_id_here", content: "Hello there!"}) {
    id
    content
    createdAt
  }
}
```

### 4. Get Conversation History
Fetch all messages between you and another user.

```graphql
query GetMessages {
  messages(recipientId: "user_id_here") {
    id
    content
    createdAt
    sender {
      id
      username
    }
  }
}
```

### 5. Receive Messages in Real-Time
Open a WebSocket connection to receive new messages.

```graphql
subscription MessageReceived {
  messageReceived(userId: "your_own_user_id") {
    id
    content
    sender {
      id
      username
    }
  }
}
```