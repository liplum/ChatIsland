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
    Client->>Server: Public key
    Server-->>Client: Accepted
```

### Authentication

JTW is used to authenticate users statelssly.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: Public key
    Server-->>Client: A token encrypted by <br/> client's public key
    Note over Client, Server: The token is a signed JWT <br/> of client's public key.
    Client->>Server: Decrypted token by <br/> my private key
```
