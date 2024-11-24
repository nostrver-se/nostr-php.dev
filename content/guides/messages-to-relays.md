# Messages to relays

According to [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions) there are the following different messages we can send as a client to a relay.

* `REQ` - used to request events and subscribe to new updates
* `EVENT` - used to publish events 
* `CLOSE` - used to stop previous subscriptions

### Request events
Request events are used for fetching data from relay. Events will be requested and with a subscription you can keep the connection open to receive new updates.
You can add multiple filters to a request message.

```php
$subscription = new Subscription();
$filter1 = new Filter();
$filter1->setKinds([0,1,30023]);
$filter1->setLimit(50);
$filter1->setTag('#t', ['PHP']);
$filter2 = new Filter();
//
$filters = [$filter1, $filter2];
$requestMessage = new RequestMessage($subscription->getId(), $filters);
```
[View example](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/request-events-filtered-with-tags.php)

### Event messages
Event messages are used for publishing Nostr event to relays.

```php
$note = new Event();
// 
$eventMessage = new EventMessage($note);
```

[View example](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/publish-event.php)

### Closing messages
A close message can be used to 'unsubscribe' an active subscription to a relay initialized by a request message.

```php
$closeMessage = new CloseMessage($subscriptionId);
```

## NIP-42 and NIP-50

There are two other message types defined in [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) (authentication of clients to relays
) and [NIP-45](https://github.com/nostr-protocol/nips/blob/master/45.md) (event counts);

### Auth messages

When a relay responds with `AUTH` (provided with a challenge string) and a following `CLOSED` response (with an auth-required message), the library will perform the authentication automatically.  

```php
$challenge = '';
$authEvent = new AuthEvent('wss://relay.io', $challenge);
$sec = '0000000000000000000000000000000000000000000000000000000000000001';
// todo: use client defined secret key here instead of this default one
$signer = new Sign();
$signer->signEvent($authEvent, $sec);
$authMessage = new AuthMessage($event);
$payload = $authMessage->generate();
```

[View NIP-42 code in library](https://github.com/nostrver-se/nostr-php/blob/main/src/Request/Request.php#L153)

### Count messages

@todo: not implemented yet.