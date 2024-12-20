# Verify event

You can use the verify method of the Event class to verify if the provided string is a valid Nostr event JSON string. 

```php
// This is a Nostr event JSON string.
$json = '{"kind":27236,"created_at":1707827688371,"tags":[],"content":"","pubkey":"07adfda9c5adc80881bb2a5220f6e3181e0c043b90fa115c4f183464022968e6","id":"7eaf0e97515c7ea8846fa2b1e28a480bec506a3f911a1ec998662201f986b0bf","sig":"22a99a1e60266c89720bf0af46ec60132eff17782aa7f582c6f990c25ef54bcefb79fdd8a95ca8bbdab9e96a0d1fd85b77a6c37e192bf74b77dd013a1d539028"}';

// Create an Event.
$event = new Event();
// Use the verify method and get a TRUE of FALSE returned.
$isValid = $event->verify($json);
```

This snippet can also be found as an example in the library here: [`src/Examples/verify.php`](https://github.com/nostrver-se/nostr-php/blob/main/src/Examples/verify.php).