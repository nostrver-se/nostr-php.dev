---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Nostr-PHP"
  text: "A PHP helper library for Nostr"
  tagline: Empower your 🐘 PHP project with Nostr.
  image:
    src: /nostr-php_hero-splash.png
    alt: Nostr-PHP
  actions:
    - theme: brand
      text: Get started
      link: /guides/get-started
    - theme: alt
      text: Join chat for support
      link: https://t.me/nostr_php    
    - theme: alt
      text: Source code
      link: https://github.com/nostrver-se/nostr-php
    

features:
  - icon: 🔐
    title: Generate keys
    details: To start interacting with the Nostr network, you need a set of keys (public key + private key) as defined in NIP-01.
    link: /guides/generate-keys
  - icon: 📤
    title: Publish events
    details: Create, sign and publish Nostr events to one or more relays.
    link: /guides/publish-event
  - icon: 📥
    title: Request events
    details: Request Nostr events from one or more relays.
    link: /guides/request-events
  - icon: 🕵🏼
    title: Send private direct messages
    details: Use NIP-17 and NIP-44 + NIP-59 to send and receive private direct messages.
    link: /guides/direct-messages
  - icon: 💠
    title: Handle bech32-encoded Nostr entities (NIP-19)
    details: Encode en decode bech32 formatted Nostr entities as described in NIP-19.
    link: /guides/nip19
  - icon: 📶
    title: Bootstrap a profile
    details: Fetch all kinds of metadata of a given pubkey or npub.
    link: /guides/bootstrap-profile-metadata
  - icon: 📃
    title: Handle relays responses
    details: When connected to a Nostr relay (with a WebSocket connection) a relay can response with different types of messages.
    link: /guides/relay-responses  
  - icon: 🔰
    title: Example snippets
    details: Learn how to use this PHP helper library for Nostr.  
    link: /examples
---

## Get started

Add the nostr-php package to your PHP project with Composer

```bash
composer require nostrverse/nostr-php
```

Here is an example how to create and publish an event to a relay:

```php
<?php

require __DIR__ . '/vendor/autoload.php';

use swentel\nostr\Event\Event;
use swentel\nostr\Key\Key;
use swentel\nostr\Message\EventMessage;
use swentel\nostr\Relay\Relay;
use swentel\nostr\Sign\Sign;

function send($message) {  
  try {        
    $key = new Key();
    $private_key = $key->generatePrivateKey(); // this will generate a private key    
    
    $relayUrl = 'wss://relay.damus.io';
        
    $note = new Event();
    $note->setKind(1);
    $note->addTag(['r', $relayUrl]);
    $note->setContent($message);
        
    $signer = new Sign();
    $signer->signEvent($note, $private_key);         
        
    $relay = new Relay($relayUrl);
    $eventMessage = new EventMessage($note);  
    $relay->setMessage($eventMessage);      
    $result = $relay->send();
        
    if ($result->isSuccess()) {
      print "The event has been sent to Nostr!\n";
    } else {
      print 'Something went wrong: ' . $response->message() . "\n";
    }
  } catch (Exception $e) {
    print 'Exception error: ' . $e->getMessage() . "\n";
  }
}

$message = 'Hello world ' . date('Y-m-d H:i:s');
send($message);

```
For more examples please check this [README](https://github.com/nostrver-se/nostr-php/blob/main/README.md) or explore the [snippets in the library](https://github.com/nostrver-se/nostr-php/tree/main/src/Examples).