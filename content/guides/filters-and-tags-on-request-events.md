# Using filters and tags on requesting events

When constructing a request message to fetch events from one of more relays, you can provide one or more filters with it.
As described in [NIP-01](https://nips.nostr.com/1#from-client-to-relay-sending-events-and-creating-subscriptions), the following attributes can be used in a filter:

* ids
* authors
* kinds
* tags
* since
* until

Please have a look at this overview with standardized tags you can use according to all NIPs: https://nips.nostr.com/#standardized-tags.

## The filter object

Create a filter object.

```php
$filter = new Filter();
```

When created, none of the attributes mentioned above are set.

## Set IDs

A list of event ids can be provided in a filter being requested.

```php
$eventIds = [
  'e8d309bdff1a8f53120e96a655fe831ee8b5cc3753754920e6c9408a742897ab',
  '31a473d65ae59e205d29316c59c703aab6f65c84b650aea025fdf4c486af62d4',
];
$filters->setIDs($eventIds);
```

## Set authors

A list of pubkeys that will match the pubkey property of events being requested.

```php
$authors = [
  '06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71', 
  '29216785f7b241a6ebbb0f58f3ef882b544dafa3f60cca666aa845c12a636a70',
  '0dc2dcb14d89f94b8a1590e178e9fbcb2ef1cb0be175a283842f9dc54787801a',
];
$filter->setAuthors($authors);
```

## Set kinds

Set which event kinds should be returned when requested.

```php
$kinds = [1, 3, 7, 30023];
$filter->setKinds($kinds);
```

## Set tags

All tags on a filter must start with the hashtag character `#`.

### Set multiple tags

```php
$tags = [
  '#t' => ['PHP', 'Drupal'],
  '#p' => ['06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71'],
];
$filter->setTags($tags);
```

### Set a single tag

```php
$filter->setTag('#t', ['Javascript', 'askNostr']);
$filter->setTag('#e', ['31a473d65ae59e205d29316c59c703aab6f65c84b650aea025fdf4c486af62d4']);
```

## Some methods for specific tags

These specific methods are provided in the filter object, but using the methods described above are recommended to use.

#### `setLowercaseETags(['event_id'])`

Equivalent of `$filter->setTag('#e', ['<event_id>']);`

#### `setLowercasePTags(['<pubkey>'])`

Equivalent of `$filter->setTag('#p', ['<pubkey>']);`

## Set since

Request events after a given date (with a timestamp in seconds).

```php
$filter->setSince(1730419200);
```

## Set until

Request events before a given date (with a timestamp in seconds).

```php
$filter->setUntil(1730419200);
```

## Set limit

Sets a maximum of number of events to be returned.

```php
$filter->setLimit(50);
```

## Using multiple filters

If you're using multiple conditions in one filter, these conditions are interpreted as `&&` (AND) conditions.
If you would like to use `||` (OR) conditions, you should use multiple filters.

## Examples

The following example will request:
* long-form content (kind `30023`) events
* written by pubkey `06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71`
* in the last month (30 days)
* a maximum of 3 (most recent) events

```php
$filter = new Filter();
$filter->setKinds([30023]);
$filter->setAuthors(['06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71']);
$filter->setSince(strtotime('-30 days'));
$filter->setLimit(3);
$subscription = new Subscription();
$requestMessage = new RequestMessage($subscription->getId(), $filters);
$relay = new Relay('wss://relay.nostr.band');
$request = new Request($relay, $requestMessage);
$response = $request->send();
```

---

The following example will request:
* short text notes (kind `1`)
* tagged with the hashtag #introductions
* written in October 2024
* a maximum of 50 (most recent) events

```php
$filter = new Filter();

```

---

The following example will request:
* written by pubkey `06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71`
* published in the last 48 hours
* all reactions (kind `7`)

OR

* all replies (kind `1` with an e tag)

```php
$since = strtotime('-48 hours');
$authors = ['06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71'];
$filter1 = new Filter();
$filter1->setKinds([7]);
$filter1->setAuthors($authors);
$filter1->setSince($since);
$filter2 = new Filter();
$filter2->setKinds([1]);
$filter2->setTag('#e', ['']);
$filter2->setAuthors($authors);
$filter2->setSince($since);
$filters = [$filter1, $filter2];
$subscription = new Subscription();
$requestMessage = new RequestMessage($subscription->getId(), $filters);
$relay = new Relay('wss://relay.nostr.band');
$request = new Request($relay, $requestMessage);
$response = $request->send();
```

---

The following example will request:
* one specific event `5780db9033a4dabc4a19305b1ea4bd0dc879bc3aa295d84a649af3055a7131fc`

OR

* all reactions (kind `7`) to that specific event
* all replies (kind `1` with an e tag) to that specific event (see [NIP-10](https://nips.nostr.com/10))

```php
$filter = new Filter();

```

---

The following example will request:
* application specific data, kind `30078` ([NIP-78](https://nips.nostr.com/78))
* published by pubkey `06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71`
* with the d tag `` (Nostr client noStrudel)

```php
$filter = new Filter();

```

---

The following example will request:
* relay list metadata, kind `10002` (see [NIP-65](https://nips.nostr.com/65))
* published by pubkey `06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71`
* only 1 event (the most recent one)

```php
$filter = new Filter();

``` 