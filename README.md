# Chat Island

Instant messaging is built on the top of websocket in real time.

## Sequence

### Register

Chat Island uses public and private key authentication.
A public key represents a user.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    Client->>Server: Public key
    Server->>Database: Check if exists
    Database-->>Server: No
    Server-->>Client: Accepted
    Server->>Database: Add a uesr
```

### Authentication

After building a websocket connection,
sending a challenge for authentication.

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: Public key
    Server->>Server: Check if registered
    Server-->>Client: A random string encrypted by <br/> client's public key
    Client->>Client: Decrypted challenge by <br/> my private key
    Client->>Server: Send back raw string
```

## Whisper

Users can talk with each other via public keys.

```mermaid
sequenceDiagram
    participant Arthur
    participant Server
    participant Julia
    Arthur->>Server: Hello, Julia.
    Note over Arthur,Server: Encrypted by Julia's public key
    Server->>Server: Save it to DB and instantly forward.
    Server->>Julia: Encrypted "Hello, Julia."
    Julia->>Julia: Decrypted by my private key.
```

## Chat Room

Uers can create a chat room,
and invite others by adding other public keys into the member list.

Members can query the member list anytime.

```mermaid
sequenceDiagram
    participant Arthur
    participant Server
    participant Others
    loop For each member
      Arthur->>Server: "Hello, everyone"
      Note over Arthur,Server: Encrypted by their public keys
    end
    Server->>Server: Save them to DB and immediately forward
    loop For each member
      Server-->>Others: Encrypted "Hello, everyone"
    end
```
