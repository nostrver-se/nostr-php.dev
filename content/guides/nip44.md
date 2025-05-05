# NIP-44: Encrypted payloads

The NIP introduces a new data format for keypair-based encryption. This NIP is versioned to allow multiple algorithm choices to exist simultaneously. This format may be used for many things, but MUST be used in the context of a signed event as described in NIP-01.

::: info Notice on how this documentation is created
Parts of these page are generated with Goose (AI agent) and Claude (LLM).
Used resources are the Nostr NIP repository and the code in the Nostr-PHP library.
This combination enables Goose and Claude to determine what to explain how to use NIP44 class.
All generated content is revised afterward.
:::

The Nostr-PHP library provides NIP-44 encryption functionality through the `Nip44` class.

## Key Features

- Uses XChaCha20-Poly1305 for encryption
- Implements perfect forward secrecy
- Provides message padding for better privacy
- Prevents message replay attacks
- Includes conversation state tracking

## Basic Usage

### Setting Up

First, import the Nip44 class:

```php
use NostrPHP\Encryption\Nip44;
```

### Encrypting messages

To encrypt a message, you need:
- Your private key (sender)
- Recipient's public key
- The message to encrypt

```php
$nip44 = new Nip44();

$privateKey = "your-private-key-hex";
$recipientPubkey = "recipient-pubkey-hex";
$message = "Hello, this is a secret message!";

$encryptedMessage = $nip44->encrypt($privateKey, $recipientPubkey, $message);
// Returns: Base64 encoded encrypted message
```

### Decrypting Messages

To decrypt a message, you need:
- Your private key (recipient)
- Sender's public key
- The encrypted message

```php
$nip44 = new Nip44();

$privateKey = "your-private-key-hex";
$senderPubkey = "sender-pubkey-hex";
$encryptedMessage = "base64-encoded-encrypted-message";

$decryptedMessage = $nip44->decrypt($privateKey, $senderPubkey, $encryptedMessage);
// Returns: Original message string
```

## Complete Example

Here's a complete example showing both encryption and decryption:

```php
use NostrPHP\Encryption\Nip44;

// Initialize the NIP-44 handler
$nip44 = new Nip44();

// Keys for Alice and Bob
$alicePrivateKey = "alice-private-key-hex";
$alicePublicKey = "alice-public-key-hex";
$bobPrivateKey = "bob-private-key-hex";
$bobPublicKey = "bob-public-key-hex";

// Alice encrypts a message for Bob
$message = "Hey Bob, this is a secure message using NIP-44!";
$encryptedMessage = $nip44->encrypt($alicePrivateKey, $bobPublicKey, $message);

// Bob decrypts the message from Alice
$decryptedMessage = $nip44->decrypt($bobPrivateKey, $alicePublicKey, $encryptedMessage);

echo $decryptedMessage; // Outputs: "Hey Bob, this is a secure message using NIP-44!"
```

## Integration with Nostr Events

When sending encrypted direct messages using NIP-44, you create an event with kind 4:

```php
use NostrPHP\Encryption\Nip44;
use NostrPHP\Event\Event;

// Initialize NIP-44
$nip44 = new Nip44();

// Your keys and recipient's public key
$privateKey = "your-private-key-hex";
$publicKey = "your-public-key-hex";
$recipientPubkey = "recipient-pubkey-hex";

// Message to encrypt
$message = "This is a private message using NIP-44";

// Encrypt the message
$encryptedContent = $nip44->encrypt($privateKey, $recipientPubkey, $message);

// Create the event
$event = new Event();
$event->kind = 4; // Direct Message event kind
$event->pubkey = $publicKey;
$event->content = $encryptedContent;
$event->tags = [
  ["p", $recipientPubkey], // Add recipient's pubkey as a "p" tag  
];

// Sign the event
$event->sign($privateKey);

// The event is now ready to be published to relays
```

## Conversation State Management

NIP-44 maintains conversation state to ensure message ordering and prevent replay attacks. The state is automatically managed by the library, but you can also explicitly manage it:

```php
use NostrPHP\Encryption\Nip44;

$nip44 = new Nip44();

// Get the current conversation state
$state = $nip44->getConversationState($privateKey, $recipientPubkey);

// Reset conversation state if needed
$nip44->resetConversationState($privateKey, $recipientPubkey);
```

## Decrypting Received Messages

@todo

## Error Handling

The encryption/decryption methods may throw exceptions in various cases:

* Invalid key formats
* Corrupted encrypted messages
* Invalid base64 encoding
* Decryption failures
* Invalid conversation states

Always wrap your encryption/decryption operations in try-catch blocks:

```php
use NostrPHP\Encryption\Nip44;

$nip44 = new Nip44();

try {
  $decryptedMessage = $nip44->decrypt($privateKey, $senderPubkey, $encryptedMessage);
} catch (\Exception $e) {
  // Handle encryption/decryption errors
  echo "Error processing message: " . $e->getMessage();
}
```

## Security Considerations

1. Always keep private keys secure and never share them
2. NIP-44 provides better security than NIP-04:
   - Perfect forward secrecy ensures past messages remain secure even if keys are compromised
   - Message padding prevents message length analysis
   - Conversation state tracking prevents replay attacks
3. Use secure methods to store and handle private keys
4. Remember that while message content is encrypted, metadata (sender, recipient, timestamp) remains visible

## References

- [NIP-44 Specification](https://github.com/nostr-protocol/nips/blob/master/44.md)
- [XChaCha20-Poly1305 Specification](https://datatracker.ietf.org/doc/html/draft-arciszewski-xchacha)
- [NIP-44 Audit-Report by Cure53 in December 2023](https://github.com/paulmillr/nip44/blob/ce63c2eaf345e9f7f93b48f829e6bdeb7e7d7964/audit-2023.12.pdf)