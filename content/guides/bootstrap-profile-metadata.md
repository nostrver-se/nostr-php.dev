# Bootstrap a profile of a given pubkey

At first, we're going to try to find the most `10002` event related to this pubkey using the [`RelayListMetadata`](https://github.com/nostrver-se/nostr-php/blob/main/src/Event/List/RelayListMetadata.php) class.

> As there is no single point of truth when it comes to the Nostr network (there are many), it's a common challenge which relay to connecto to start collecting data.
> For this challenge, it's a best-practive to follow [NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md) where an event is defined with a list of relays where a pubkey reads from and writes to.

```php
$pubkey = '06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71';
$relayListMetadata = new RelayListMetadata($pubkey);
```
Now we can get all the relays:
```php
// This is the list of relays where the given pubkey reads from.
$readRelays = $relayListMetadata->getReadRelays();
// This is the list of relays where the given pubkey writes (publishes) too.
$writeRelays = $relayListMetadata->getWriteRelays();
```
Now if these variables are not empty, we can create a profile.

### Profile metadata

The [`Profile`](https://github.com/nostrver-se/nostr-php/blob/main/src/Event/Profile/Profile.php) class extends the `Event` class which can be used to request a kind `0` event (with user metadata) of a given pubkey (first argument).
For the second (optional) argument we can use one of the fetched write relays. We assume that on these relays we can find events where the pubkey writes to, so we should try to find a kind `0` event there.

```php
$profile = new Profile();
$pubkey = '06639a386c9c1014217622ccbcf40908c4f1a0c33e23f8d6d68f4abf655f8f71';
$profile->fetch($pubkey, $writeRelays[0] ?? NULL); # If $writeRelays is empty, the default relay value in the Profile will be used.
```
Now you can parse different fields of metadata from this profile.

* `$profile->name`
* `$profile->about`
* `$profile->display_name`
* `$profile->picture`
* `$profile->banner`
* `$profile->nip05`
* `$profile->lud06`
* `$profile->lud16`

### Request list with following

Here is an example how to request the follow list with pubkeys (which are stored in an event kind `3`, see [NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md)) which are followed by the given pubkey.

```php
$subscription = new Subscription();
$filters = [];
$filter = new Filter();
$filter->setKinds([3]);
$filter->setAuthors([$pubkey]);
$filter->setLimit(1);
$filters = [$filter];
$relaySet = new RelaySet();
# As you can see, we use the $writeRelays here again to request events where the given pubkey writes to.
foreach ($writeRelays as $relay_url) {
  $relay = new Relay($relay_url);
  $relaySet->addRelay($relay);
}
$requestMessage = new RequestMessage($subscription->getId(), $filters);
$request = new Request($relaySet, $requestMessage);
$response = $request->send();
$following_lists = [];
foreach ($response as $relayUrl => $relayResponses) {
  print 'Received ' . count($response[$relayUrl]) . ' message(s) received from relay ' . $relayUrl . PHP_EOL;
  foreach ($relayResponses as $relayResponse) {
    if ($relayResponse instanceof RelayResponseEvent && isset($relayResponse->event)) {
      $following_list_event = new Event();
      $following_list_event->populate($relayResponse->event);
      if(!isset($following_lists[$relayUrl][$following_list_event->getId()])) {
        $following_lists[$relayUrl][$following_list_event->getId()] = $following_list_event;
        $pTags = $following_list_event->getTag('p');
          print 'Found following list with ' . count($pTags) . ' pubkeys on relay ' . $relayUrl . PHP_EOL;
      }
    }
  }
}
```

### Other lists related to this pubkey / profile

This has still to be worked out in the library with specific event class, but you can request other lists and sets too described in [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md).

TODO:
* Mute list (kind `10000`)
* Pinned notes (kind `10001`)
* Bookmarks (kind `10003`)
* Communities (kind `10004`)
* Public chats (kind `10005`)
* Blocked relays (kind `10006`)
* Search relays (kind `10007`)
* Simple groups (kind `10009`)
* Favorite relays (kind `10012`)
* Interests (kind `10015`)
* Media follows (kind `10020`)
* Emojis (kind `10030`)
* DM relays (kind `10050`)
* Good wiki authors (kind `10101`)
* Good wiki relays (kind `10102`)

## Full example

A full example with all the snippets from above can be found [here](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/bootstrap-profile-with-pubkey.php).