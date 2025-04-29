# Manage tags on an event

There are many tags you can use on Nostr events. Please check this [overview](https://nips.nostr.com/#standardized-tags) with standardized tags to see which ones you can use on different event kinds.
Please be aware that a tag can have a different meaning with different event kinds (e.g. an 'r' tag may have a meaning in an event of kind `1` and an entirely different meaning in an event of kind `10002`).
You're not tied to this list, as you have the freedom to add any tag to an event. When doing this, expect that not all relays will accept your event.

## Structure

Tags on a `Event` class are formatted as an array. This array contains one or more arrays. Each array contains comma seperated values.
Here is an example:

```php
{
    'id': '',
    'pubkey': '',
    'kind': 1,
    'tags': [
        ['e', '<hex formatted event id>', '<relay url, optional>'],
        ['t', 'hashtag'],
        ['d', 'identifier'],
        ['client', 'Client tag / name', '31990:app1-pubkey:<d-identifier>', 'wss://relay1'],
        ['p', '<hex formatted pubkey>', '<relay url, optional>'],        
        ['r', 'wss://relay1'],
        ['r', 'wss://relay2'],
        ...
    ],
    'created_at': <unix timestamp>,
}
```

## Adding tags

Tags are set on a `Event` class with the `addTag()` and `setTags()` methods.

Add single tags to an event:

```php
$event = new Event();
$tag = ['t', 'php']; // Hashtag php
$event->addTag($tag);
$tag = ['r', 'wss://relay1']; // Relay tag
$event->addTag($tag); 
```

Add multiple tags to an event:

```php
$event = new Event();
$tags = [
    ['p', '<hex formatted pubkey>', '<relay url, optional>'],
    ['t', 'introductions'],
    ['r', 'wss://relay1'],
    ['r', 'wss://relay2'],
];
$event->setTags($tags);
```

## Getting all tags

Getting all tags from an `Event` is possible with the `getTags()` method.

```php
$tags = $event->getTags();
```
This will return an array with all the tags.

## Getting specific tags

Getting specific tags with a key from an `Event` can be done with the `getTag()` method.

```php
$hashtags = $event->getTag('t')
```

This will return a hashtags from an event.

```php
$relayTags = $event->getTag('r')
```

This will return all relay tags from an event.