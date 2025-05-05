# NIP-05 lookup

With the `Nip05Helper` class you can easily request (with a simple http GET request) a given "nip05" internet identifier.
This identifier is often part of the event kind 0 (user metadata) related to a pubkey. You can fetch this metadata with the [Profile](/guides/fetch-profile-metadata) class in the library.
If available, a JSON document object is returned.

Here is a simple example using the Nip05Helper class.

```php
// The internet identifier
$identifier = 'sebastian@sebastix.dev';
$nip05 = new Nip05Helper();
// Get the public key
$pubkey = $nip05->getPublicKey($identifier);  
// Get the relays
$relays = $nip05->getRelays($identifier);
```

## Resources

* [NIP-05 specification](https://github.com/nostr-protocol/nips/blob/master/05.md)