# Direct messages

## Overview
For direct messages the Nostr-PHP library provides:
* [NIP-17 Private Direct messages](https://github.com/nostr-protocol/nips/blob/master/17.md)
* [⚠️ NIP-04 Encrypted Direct Messages](https://github.com/nostr-protocol/nips/blob/master/04.md) (deprecated in favor of NIP-17).

This allows you to encrypt and decrypt direct messages between two users using their respective keys.

## Using NIP-17

We will explain the following basic principles:
* seal and gift-wrap a direct message to be sent
* encrypt the content of a direct message to be sent
* decrypt a (received) direct message

@todo

![NIP-17 Private Direct Messages](/nip17-direct-messages.png)

### Full example
Here's a complete example showing both encryption and decryption:

```php
// Set up keys for Alice and Bob
$key = new Key();
$sign = new Sign();
$giftWrapService = new GiftWrapService($key, $sign);

try {
    // Alice's private and public keys
    $alicePrivKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    $alicePubKey = $key->getPublicKey($alicePrivKey);
    print "Alice's public key: " . $alicePubKey . PHP_EOL;

    // Bob's private and public keys
    $bobPrivKey = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
    $bobPubKey = $key->getPublicKey($bobPrivKey);
    print "Bob's public key: " . $bobPubKey . PHP_EOL;

    // Create DirectMessage service
    $directMessage = new DirectMessage($giftWrapService, $key);

    print PHP_EOL . "===== SENDING A PRIVATE DIRECT MESSAGE =====" . PHP_EOL;

    // Message from Alice to Bob
    $messageText = "Hey Bob, this is a private message that only you can read!";
    print "Alice is sending message to Bob: '" . $messageText . "'" . PHP_EOL;

    // Send the direct message, creating gift wraps for both sender and receiver
    $result = $directMessage->sendDirectMessage(
        $alicePrivKey,
        $bobPubKey,
        $messageText,
    );

    // Display information about the created gift wraps
    print PHP_EOL . "Two gift wraps were created:" . PHP_EOL;
    print "1. Receiver gift wrap (for Bob):" . PHP_EOL;
    print "   - Kind: " . $result['receiver']->getKind() . PHP_EOL;
    print "   - ID: " . $result['receiver']->getId() . PHP_EOL;

    print PHP_EOL . "2. Sender gift wrap (for Alice):" . PHP_EOL;
    print "   - Kind: " . $result['sender']->getKind() . PHP_EOL;
    print "   - ID: " . $result['sender']->getId() . PHP_EOL;

    print PHP_EOL . "===== PUBLISHING GIFT WRAPS TO RELAYS =====" . PHP_EOL;

    // Normally, you would get the relay list from the kind 10050 event (see NIP-51)
    // but for this example, we'll use hardcoded relay URLs
    print "Publishing to receiver's relay: wss://relay.example.com" . PHP_EOL;

    // In a real implementation, you would publish to relays from the result
    // $receiverRelays = $result['receiver_relays'];
    // $senderRelays = $result['sender_relays'];

    print PHP_EOL . "===== SIMULATING GIFT WRAP RECEPTION AND DECRYPTION =====" . PHP_EOL;

    // Simulate Bob receiving the gift wrap
    print "Bob received a gift wrap with ID: " . $result['receiver']->getId() . PHP_EOL;

    // In a real scenario, Bob would look for gift wraps addressed to him (p tag with his pubkey)
    // For this example, we'll just use the gift wrap we already created

    // Using the new static decryptDirectMessage helper method
    print "Bob is decrypting the message using his private key and Alice's public key..." . PHP_EOL;
    $decryptedEvent = DirectMessage::decryptDirectMessage(
        $result['receiver'],  // The gift wrap to decrypt
        $bobPrivKey,          // Bob's private key
        true,                 // Verify the gift wrap is addressed to Bob
    );

    if ($decryptedEvent) {
        print "Decryption successful!" . PHP_EOL;

        print PHP_EOL . "===== DECRYPTED MESSAGE DETAILS =====" . PHP_EOL;
        print "Message kind: " . $decryptedEvent['kind'] . PHP_EOL;
        print "Message content: '" . $decryptedEvent['content'] . "'" . PHP_EOL;

        // Get the p tags to identify the participants
        $tags = $decryptedEvent['tags'] ?? [];
        $participants = [];

        foreach ($tags as $tag) {
            if ($tag[0] === 'p') {
                $participants[] = $tag[1];
            }
        }

        print "Participants: " . implode(', ', $participants) . PHP_EOL;

        // Bob can now reply to Alice using the same process
        print PHP_EOL . "===== BOB REPLYING TO ALICE =====" . PHP_EOL;

        // Create a reply message
        $replyText = "Hey Alice, thanks for your message! This is a private reply.";
        print "Bob is sending reply to Alice: '" . $replyText . "'" . PHP_EOL;

        // Use the ID of the original message for reply
        $originalMessageId = $decryptedEvent['id'] ?? null;

        // Send the reply as a direct message
        $replyResult = $directMessage->sendDirectMessage(
            $bobPrivKey,
            $alicePubKey,
            $replyText,
            [],
            $originalMessageId,  // Set as reply to the original message
        );

        print PHP_EOL . "Reply gift wrap created with ID: " . $replyResult['receiver']->getId() . PHP_EOL;

        // Alice can now decrypt Bob's reply
        print PHP_EOL . "===== ALICE DECRYPTING BOB'S REPLY =====" . PHP_EOL;
        print "Alice received a gift wrap with ID: " . $replyResult['receiver']->getId() . PHP_EOL;

        $decryptedReply = DirectMessage::decryptDirectMessage(
            $replyResult['receiver'],  // The gift wrap to decrypt
            $alicePrivKey,             // Alice's private key
            true,                      // Verify the gift wrap is addressed to Alice
        );

        if ($decryptedReply) {
            print "Alice successfully decrypted Bob's reply!" . PHP_EOL;
            print "Reply content: '" . $decryptedReply['content'] . "'" . PHP_EOL;

            // Check if it's a reply to the original message
            $isReply = false;
            foreach ($decryptedReply['tags'] as $tag) {
                if ($tag[0] === 'e' && isset($tag[1]) && $tag[1] === $decryptedEvent['id']) {
                    $isReply = true;
                    break;
                }
            }

            if ($isReply) {
                print "This is a reply to Alice's original message." . PHP_EOL;
            }
        } else {
            print "Alice could not decrypt the message." . PHP_EOL;
        }
    } else {
        print "Decryption failed! The message might not be for Bob or the encryption keys don't match." . PHP_EOL;
    }

} catch (Exception $e) {
    print 'Exception: ' . $e->getMessage() . PHP_EOL;
}
```
See also [NIP-17 example in the library code](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/nip17-private-direct-messages.php).

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

### Full example
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

### Integration with Nostr Events
When sending encrypted direct messages in Nostr, you typically create an event with kind `4`. Here's how to integrate NIP-04 encryption with event creation:

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

### Security and privacy considerations
Always keep private keys secure and never share them
Verify the sender's public key before trusting decrypted messages
Use secure methods to store and handle private keys
Remember that while message content is encrypted, metadata (sender, recipient, timestamp) remains visible. [NIP-17]() fixes this.

## References
* [NIP-04 specification](https://github.com/nostr-protocol/nips/blob/master/04.md)
* [NIP-17 specification](https://github.com/nostr-protocol/nips/blob/master/17.md)
* [Many DM Standards lead to undelivered/unread DMs & uncertainty](https://github.com/nostrability/nostrability/issues/169)