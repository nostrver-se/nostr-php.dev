# NIP-19: bech32-encoded entities

NIP-19 defines a standard way to encode different Nostr entities like public keys, private keys, note IDs, and profile references using bech32 encoding. This makes these entities more human-readable and includes error detection.

## Overview

The Nostr-PHP library provides comprehensive support for NIP-19 through the `Nip19Helper` class. This allows you to encode and decode various Nostr entities using bech32 format.

## Supported Entity Types

- `npub`: Public keys
- `nsec`: Private keys
- `note`: Note IDs
- `nprofile`: Profile references
- `nevent`: Event references
- `naddr`: Parameterized Replaceable Events (NIP-33)

## Basic Usage

### Encoding Public Keys

```php
use NostrPHP\Nip19\Nip19Helper;

$publicKey = "7f3b456789..."; // Your 32-byte hex public key
$encodedPubkey = Nip19Helper::encodePubkey($publicKey);
// Returns: npub1...
```

### Decoding Public Keys

```php
use NostrPHP\Nip19\Nip19Helper;

$npub = "npub1...";
$decodedPubkey = Nip19Helper::decodePubkey($npub);
// Returns: 7f3b456789...
```

### Encoding Private Keys

```php
use NostrPHP\Nip19\Nip19Helper;

$privateKey = "1234567890..."; // Your 32-byte hex private key
$encodedPrivkey = Nip19Helper::encodePrivkey($privateKey);
// Returns: nsec1...
```

### Decoding Private Keys

```php
use NostrPHP\Nip19\Nip19Helper;

$nsec = "nsec1...";
$decodedPrivkey = Nip19Helper::decodePrivkey($nsec);
// Returns: 1234567890...
```

### Encoding Note IDs

```php
use NostrPHP\Nip19\Nip19Helper;

$noteId = "abcdef1234..."; // 32-byte hex note ID
$encodedNote = Nip19Helper::encodeNote($noteId);
// Returns: note1...
```

### Decoding Note IDs

```php
use NostrPHP\Nip19\Nip19Helper;

$note = "note1...";
$decodedNote = Nip19Helper::decodeNote($note);
// Returns: abcdef1234...
```

### Working with Profile References

Profile references (`nprofile`) contain a public key and optionally a list of relay URLs where the profile can be found.

```php
use NostrPHP\Nip19\Nip19Helper;

// Encoding a profile reference
$pubkey = "7f3b456789...";
$relays = ["wss://relay.example.com", "wss://relay2.example.com"];
$encodedProfile = Nip19Helper::encodeProfile($pubkey, $relays);
// Returns: nprofile1...

// Decoding a profile reference
$nprofile = "nprofile1...";
$decodedProfile = Nip19Helper::decodeProfile($nprofile);
// Returns: array containing pubkey and relays
```

### Working with Event References

Event references (`nevent`) contain an event ID and optionally relay URLs and an author public key.

```php
use NostrPHP\Nip19\Nip19Helper;

// Encoding an event reference
$eventId = "abcdef1234...";
$relays = ["wss://relay.example.com"];
$author = "7f3b456789..."; // Optional author pubkey
$encodedEvent = Nip19Helper::encodeEvent($eventId, $relays, $author);
// Returns: nevent1...

// Decoding an event reference
$nevent = "nevent1...";
$decodedEvent = Nip19Helper::decodeEvent($nevent);
// Returns: array containing event ID, relays, and author if provided
```

### Working with Addressable Events (naddr)

The `naddr` prefix is used for parameterized replaceable events. It allows referencing specific replaceable events by their coordinates: kind, pubkey, and identifier.

```php
use NostrPHP\Nip19\Nip19Helper;

// Encoding an addressable event
$pubkey = "7f3b456789...";   // Author's public key
$kind = 30023;               // Event kind (e.g., 30023 for long-form content)
$identifier = "blog-post-1"; // The d-tag identifier
$relays = ["wss://relay.example.com"]; // Optional relay hints

$encodedAddr = Nip19Helper::encodeAddr($pubkey, $kind, $identifier, $relays);
// Returns: naddr1...

// Decoding an addressable event
$naddr = "naddr1...";
$decodedAddr = Nip19Helper::decodeAddr($naddr);
// Returns: array containing pubkey, kind, identifier, and relays if provided
```

## Error Handling

The Nip19Helper methods will throw exceptions if:
- Input data is invalid or malformed
- The bech32 string has an invalid checksum
- The prefix doesn't match the expected type
- The decoded data length is incorrect

It's recommended to wrap NIP-19 operations in try-catch blocks to handle potential errors gracefully:

```php
use NostrPHP\Nip19\Nip19Helper;

try {
    $decodedPubkey = Nip19Helper::decodePubkey($npub);
} catch (\Exception $e) {
    // Handle invalid or malformed input
    echo "Error decoding pubkey: " . $e->getMessage();
}
```

## References

- [NIP-19 Specification](https://github.com/nostr-protocol/nips/blob/master/19.md)