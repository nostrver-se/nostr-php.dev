# Publish event

Let's say we would like to transmit a simple note to a single Nostr relay.

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
$note->addTag(['t', 'introduction']); // This is a generic hashtag.
$note->addTag(['r', 'wss://relay.nostr.band']); // This is a relay hint tag.
```

There are many tags you can use, and it also depends on the event kind how these tags should be handled by clients.
Find out more in the [Manage tags on an event](/guides/manage-tags-on-an-event) guide.

## Set content

```php
$content = 'Hello Nostr world!';
$note->setContent($content);
```

## Sign event

To sign the event, you will need a private key. In the example below a new generated private key is used.

```php
$private_key = new Key(); 
$private_key = = $private_key->generatePrivateKey();
$signer = new Sign();
$signer->signEvent($note, $private_key);
```

## Verify

This will return a boolean.

```php
$isValid = $note->verify();
```

## Transmit a message with the event to a single relay

We now should have a note event which is ready to be transmitted to one relay.
We will use the `EventMessage` to generate a message to be sent to the relay.

```php
$relay = new Relay('wss://relay.nostr.band');
$eventMessage = new EventMessage($note);
$relay->setMessage($eventMessage);      
$request = new Request($relay, $eventMessage);
$response = $request->send();
```

## Relay response

When the message has been sent to the relay, it will return a RelayResponse object.

```php
foreach ($response as $relayUrl => $relayResponses) {
    foreach ($relayResponses as $relayResponse) {
        if ($relayResponse->isSuccess) {
            print 'The event has been transmitted to the relay.' . PHP_EOL;
            $eventId = $response->eventId;
        }
    }
}
```

## Full snippet

```php
// Compose event.
$note = new Event();
$note->setKind(1);
$note->addTag(['t', 'introduction']);
$note->addTag(['r', 'wss://relay.nostr.band']); 
$content = 'Hello Nostr world!';
$note->setContent($content);
// Sign event.
$private_key = new Key(); 
$private_key = $private_key->generatePrivateKey();
$signer = new Sign();
$signer->signEvent($note, $private_key);
// Optional, verify event.
$isValid = $note->verify();
// Transmit the event to a relay.
$relay = new Relay('wss://relay.nostr.band');
$eventMessage = new EventMessage($note);
$relay->setMessage($eventMessage);      
$request = new Request($relay, $eventMessage);
$response = $request->send();
// Handle response.
foreach ($response as $relayUrl => $relayResponses) {
    foreach ($relayResponses as $relayResponse) {
        if ($relayResponse->isSuccess) {
          print 'The event has been transmitted to the relay.' . PHP_EOL;
          $eventId = $relayResponse->eventId;
          // Now we could request the event with this id.
        }    
    }
}
```
Snippet how to publish events can also be found as an example in the library here: 
[`src/Examples/publish-event.php`](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/publish-event.php) and [`src/Examples/publish-event-with-auth.php`](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/publish-event-with-auth.php).