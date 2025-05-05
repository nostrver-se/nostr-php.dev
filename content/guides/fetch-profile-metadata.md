# Fetch profile metadata of a pubkey

The `Profile` class extends the `Event` class which can be used to request a kind 0 event (with user metadata) of a given pubkey from a given relay (optional).

```php
$profile = new Profile();
$pubkey = '06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71';
$profile->fetch($pubkey, 'wss://relay.nostr.band');
```