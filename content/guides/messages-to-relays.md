# Messages to relays

According to [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions) there are the following different messages we can send as a client to a relay.

* `REQ` - used to request events and subscribe to new updates
* `EVENT` - used to publish events 
* `CLOSE` - used to stop previous subscriptions

### Request messages
Request messages are used for fetching data from relay. Events will be requested and with a subscription you can keep the connection open to receive new updates.
You can add multiple filters to a request message.

```php
$subscription = new Subscription();
$subscriptionId = $subscription->setId();
$filter1 = new Filter();
$filter1->setKinds([0,1,30023]);
$filter1->setLimit(50);
$filter2 = new Filter();
//
$filters = [$filter1, $filter2];
$requestMessage = new RequestMessage($subscriptionId, $filters);
```

### Event messages
Event messages are used for publishing Nostr event to relays.

```php
$note = new Event();
// 
$eventMessage = new EventMessage($note);
```

### Closing messages
A close message can be used to 'unsubscribe' an active subscription to a relay initialized by a request message.

```php
$closeMessage = new CloseMessage($subscriptionId);
```