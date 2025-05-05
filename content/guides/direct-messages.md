# Direct messages

## Overview
The Nostr-PHP library provides:
* NIP-04 encryption functionality through the Nip04 class. 
* NIP-17

This allows you to encrypt and decrypt direct messages between two users using their respective keys.

## Using NIP-17

@todo
![NIP-17 DMs](/nip17-direct-messages.png)

## Using NIP-04

::: warning NIP-04 is deprecated
⚠️ This NIP is deprecated in favor of [NIP-17](https://nips.nostr.com/17)
:::

NIP-04 defines the standard for encrypted direct messages in Nostr. It uses shared-secret encryption with a shared key derived from the sender's private key and the recipient's public key.

## Basic Usage
### Setting Up
First, import the Nip04 class:

```php
use NostrPHP\Encryption\Nip04;
```

### Encrypting messages
To encrypt a message, you need:

* Your private key (sender)
* Recipient's public key
* The message to encrypt

```php
$nip04 = new Nip04();

$privateKey = "your-private-key-hex";
$recipientPubkey = "recipient-pubkey-hex";
$message = "Hello, this is a secret message!";

$encryptedMessage = $nip04->encrypt($privateKey, $recipientPubkey, $message);
// Returns: Base64 encoded encrypted message with initialization vector
// Format: <initialization vector>?<encrypted message>
```

### Decrypting messages
To decrypt a message, you need:

* Your private key (recipient)
* Sender's public key
* The encrypted message

```php
$nip04 = new Nip04();

$privateKey = "your-private-key-hex";
$senderPubkey = "sender-pubkey-hex";
$encryptedMessage = "base64-encoded-encrypted-message"; // Format: iv?ciphertext

$decryptedMessage = $nip04->decrypt($privateKey, $senderPubkey, $encryptedMessage);
// Returns: Original message string
```

## Complete Example
Here's a complete example showing both encryption and decryption:

```php
use NostrPHP\Encryption\Nip04;

// Initialize the NIP-04 handler
$nip04 = new Nip04();

// Keys for Alice and Bob
$alicePrivateKey = "alice-private-key-hex";
$alicePublicKey = "alice-public-key-hex";
$bobPrivateKey = "bob-private-key-hex";
$bobPublicKey = "bob-public-key-hex";

// Alice encrypts a message for Bob
$message = "Hey Bob, this is a secret message!";
$encryptedMessage = $nip04->encrypt($alicePrivateKey, $bobPublicKey, $message);

// Bob decrypts the message from Alice
$decryptedMessage = $nip04->decrypt($bobPrivateKey, $alicePublicKey, $encryptedMessage);

echo $decryptedMessage; // Outputs: "Hey Bob, this is a secret message!"
````

## Integration with Nostr Events
When sending encrypted direct messages in Nostr, you typically create an event with kind 4. Here's how to integrate NIP-04 encryption with event creation:

```php
use NostrPHP\Encryption\Nip04;
use NostrPHP\Event\Event;

// Initialize NIP-04
$nip04 = new Nip04();

// Your keys and recipient's public key
$privateKey = "your-private-key-hex";
$publicKey = "your-public-key-hex";
$recipientPubkey = "recipient-pubkey-hex";

// Message to encrypt
$message = "This is a private message";

// Encrypt the message
$encryptedContent = $nip04->encrypt($privateKey, $recipientPubkey, $message);

// Create the event
$event = new Event();
$event->kind = 4; // Direct Message event kind
$event->pubkey = $publicKey;
$event->content = $encryptedContent;
$event->tags = [["p", $recipientPubkey]]; // Add recipient's pubkey as a "p" tag

// Sign the event
$event->sign($privateKey);

// The event is now ready to be published to relays
```

### Decrypting Received Messages
When receiving encrypted direct messages, you'll need to decrypt them:

```php
use NostrPHP\Encryption\Nip04;

// Initialize NIP-04
$nip04 = new Nip04();

// Assuming you received an event with kind 4
$receivedEvent = /* event from relay */;

// Your private key and sender's public key
$privateKey = "your-private-key-hex";
$senderPubkey = $receivedEvent->pubkey;

// Decrypt the message
try {
  $decryptedMessage = $nip04->decrypt(
    $privateKey,
    $senderPubkey,
    $receivedEvent->content
  );
  echo "Decrypted message: " . $decryptedMessage;
} catch (\Exception $e) {
  echo "Failed to decrypt message: " . $e->getMessage();
}
```

### Error Handling
The encryption/decryption methods may throw exceptions in various cases:

* Invalid key formats
* Corrupted encrypted messages
* Invalid base64 encoding
* Decryption failures
* Always wrap your encryption/decryption operations in try-catch blocks:

```php
use NostrPHP\Encryption\Nip04;

$nip04 = new Nip04();

try {
  $decryptedMessage = $nip04->decrypt($privateKey, $senderPubkey, $encryptedMessage);
} catch (\Exception $e) {
  // Handle encryption/decryption errors
  echo "Error processing message: " . $e->getMessage();
}
```

## Security and privacy considerations
Always keep private keys secure and never share them
Verify the sender's public key before trusting decrypted messages
Use secure methods to store and handle private keys
Remember that while message content is encrypted, metadata (sender, recipient, timestamp) remains visible.

## References
* [NIP-04 specification](https://github.com/nostr-protocol/nips/blob/master/04.md)
* [NIP-17 specification](https://github.com/nostr-protocol/nips/blob/master/17.md)
* [Many DM Standards lead to undelivered/unread DMs & uncertainty](https://github.com/nostrability/nostrability/issues/169)