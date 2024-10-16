# Request events

Requesting data (Nostr events) from a relay is quite simple.

## Create a subscription

```php
$subscription = new Subscription();
$subscriptionId = $subscription->setId();
```

## Create a filter and compose the request message

We will use the `RequestMessage` to generate a message to be sent to the relay.

```php
$filter1->setKinds([1]); // Only fetch kind 1 events.
$filter1->setLimit(25); // Will return max 25 events.
$filters = [$filter1];
$requestMessage = new RequestMessage($subscriptionId, $filters);
```

## Send the request message to the relay

```php
$relay = new Relay('wss://relay.nostr.band');    
$request = new Request($relay, $requestMessage);
$response = $request->send();
```

## Handle the relay response

The `$response` variable will return a multidimensional array. 

```php
/**
 * @var string $relayUrl
 *   The relay URL.
 * @var object $relayResponses
 *   RelayResponses which will contain the messages returned by the relay.
 *   Each message will also contain the event.
 */
foreach ($response as $relayUrl => $relayResponses) {
    print 'Received ' . count($response[$relayUrl]) . ' message(s) found from relay ' . $relayUrl . PHP_EOL;
    /** @var \swentel\nostr\RelayResponse\RelayResponseEvent $message */
    foreach ($relayResponses as $message) {        
        // Print content of the note:
        print $message->event->content . PHP_EOL;
    }
}
```

## Full snippet

```php
$subscription = new Subscription();
$subscriptionId = $subscription->setId();

$filter1 = new Filter();
$filter1->setKinds([1]);
$filter1->setLimit(25);
$filters = [$filter1];
$requestMessage = new RequestMessage($subscriptionId, $filters);
$relay = new Relay('wss://relay.nostr.band');
$request = new Request($relay, $requestMessage);
$response = $request->send();

/**
 * @var string $relayUrl
 *   The relay URL.
 * @var object $relayResponses
 *   RelayResponses which will contain the messages returned by the relay.
 *   Each message will also contain the event.
 */
foreach ($response as $relayUrl => $relayResponses) {
    print 'Received ' . count($response[$relayUrl]) . ' message(s) found from relay ' . $relayUrl . PHP_EOL;
    /** @var \swentel\nostr\RelayResponse\RelayResponseEvent $message */
    foreach ($relayResponses as $message) {
        print $message->event->content . PHP_EOL;
    }
}
```

This snippet can also be found as an example in the library here: [`src/Examples/request-events.php`](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/request-events.php).

## Full snippet how to request data from multiple relays

Let's say you would like to request events from multiple relays. We can use the `RelaySet` class for this purpose.

```php
$subscription = new Subscription();
$subscriptionId = $subscription->setId();
// We are going to request 100 notes from 1 author from each given relay.
$filter1 = new Filter();
$filter1->setAuthors(
    [
        'npub1qe3e5wrvnsgpggtkytxteaqfprz0rgxr8c3l34kk3a9t7e2l3acslezefe',
    ],
);
$filter1->setKinds([1]);
$filter1->setLimit(100);
$filters = [$filter1];
$requestMessage = new RequestMessage($subscriptionId, $filters);
// Array with all the relays we're requesting data from.
$relays = [
    new Relay('wss://nostr.sebastix.dev'),        
    new Relay('wss://relay.damus.io'),        
    new Relay('wss://welcome.nostr.wine'),
    new Relay('wss://nos.lol'),
    new Relay('wss://relay.nostr.band'),
    new Relay('wss://sebastix.social/relay'),
    new Relay('wss://nostr.wine'),        
    new Relay('wss://pyramid.fiatjaf.com'),
];
$relaySet = new RelaySet();
$relaySet->setRelays($relays);
$request = new Request($relaySet, $requestMessage);
$response = $request->send();
/**
 * @var string $relayUrl
 *   The relay URL.
 * @var object $relayResponses
 *   RelayResponses which will contain the messages returned by the relay.
 *   Each message will also contain the event.
 */
foreach ($response as $relayUrl => $relayResponses) {
    print 'Received ' . count($response[$relayUrl]) . ' message(s) found from relay ' . $relayUrl . PHP_EOL;
    foreach ($relayResponses as $message) {
        print $message->event->content . PHP_EOL;
    }
}
```

This snippet can also be found as an example in the library here: [`src/Examples/request-events-from-multiple-relays.php`](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/request-events-from-multiple-relays.php).
