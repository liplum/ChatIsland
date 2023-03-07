# Chat Island

The system is currently designed to be used with HTPPS.
Without HTPPS, it's vulnerable to be attacked by man-in-the-middle attacks.

## User and Authentication

Chat Island uses public and private key authentication.

### Register

A public key represents a user.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    Client->>Server: Public key
    Server-->>Client: Accepted
    Server->>Database: Add a uesr
```

### Authentication

JWT is used to authenticate users statelssly.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    Client->>Server: Public key
    Server->>Database: Check if registered
    Server-->>Client: A token encrypted by <br/> client's public key
    Note over Client, Server: The token is a signed JWT <br/> of client's public key.
    Client->>Client: Decrypted token by <br/> my private key
```

## Messaging

Instant messaging is built on the top of websocket in real time.

### Whisper

Users can talk with each other via public keys.

```mermaid
sequenceDiagram
    participant Arthur
    participant Server
    participant Julia
    Arthur->>Server: Hello, Julia.
    Server->>Server: Encrypt message <br/> by Julia's public key <br/> and save it to DB.
    Server->>Julia: Encrypted "Hello, Julia."
    Julia->>Julia: Decrypted by my private key.
```
