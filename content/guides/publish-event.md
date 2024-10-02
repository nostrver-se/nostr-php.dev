# Publish event

Let's say we would like to broadcast a simple note to some Nostr relays.

## Create event

```php
$note = new Event();
```

## Set kind

```php
$note->setKind(1);
```
Kind number `1` is the most used and famous one for Nostr. There are many other kind numbers you can use for different purposes.

## Add tags

```php
$note->addTag(['t', 'introductions']); // This is a generic hashtag.
$note->addTag(['r', 'wss://relay.nostr.band']); // This is a relay hint tag.
```

There are many tags you can use and it also depends on the event kind how these tags should be handled by clients.

## Set content

```php
$content = 'Hello Nostr world!';
$note->setContent($content);
```

## Sign event

To sign the event, you will need a private key. In the example below a new generated private key is used.

```php
$private_key = new Key(); 
$private_key->generatePrivateKey();
$signer = new Sign();
$signer->signEvent($note, $private_key);
```

## Verify

```php
$note->verify();
```

## Broadcast a message with the event to a relay

We now should have a note event which is ready to be broadcasted to a relay.
We will use the `EventMessage` to generate a message to be sent to the relay.

```php
$relay = new Relay('wss://relay.nostr.band');
$eventMessage = new EventMessage($note);
$relay->setMessage($eventMessage);      
$response = $relay->send();
```

## Relay response

```php

```

## Full snippet