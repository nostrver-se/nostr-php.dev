---
title: Generate keys
---

# Generate keys

## Create a private key

```php
$privateKey = new Key();
$privateKey->generatePrivateKey();
```
This will give you a hex formatted private key.

## Get public key from a private key

```php
$key = new Key();
// In case your private key is not a hex formatted key: 
$private_key_hex = $key->convertToHex($private_key);
$public_key_hex = $key->getPublicKey($private_key_hex);
```
This will give you a hex formatted pubkey (public key) based on the provided hex formatted private key.

## Get bech32 encoded keys (npub and nsec)

```php
$key = new Key();
$nsec_key = $key->convertPublicKeyToBech32($public_key_hex);
```
This will give you an `npub` formatted private key.

```php
$key = new Key();
$npub_key = $key->convertPrivateKeyToBech32($private_key_hex);
```
This will give you an `nsec` formatted private key.