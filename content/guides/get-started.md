---
title: Get started with Nostr-PHP
---

# Get Started

## Try it out online

Go to https://play.phpsandbox.io/swentel/nostr-php?version=dev-main and paste the following code snippet:

```php
<?php

declare(strict_types=1);

use swentel\nostr\Filter\Filter;
use swentel\nostr\Message\RequestMessage;
use swentel\nostr\Relay\Relay;
use swentel\nostr\Request\Request;
use swentel\nostr\Subscription\Subscription;

require __DIR__ . '/vendor/autoload.php';

try {
    $subscription = new Subscription();
    $filter1 = new Filter();
    $filter1->setKinds([1]);
    $filter1->setLimit(25);
    $filters = [$filter1];
    $requestMessage = new RequestMessage($subscription->getId(), $filters);
    $relay = new Relay('wss://relay.nostr.band');
    $request = new Request($relay, $requestMessage);
    $response = $request->send();

    /**
     * @var string $relayUrl
     *   The relay URL.
     * @var object $relayResponse
     *   RelayResponse which will contain the messages returned by the relay.
     */
    foreach ($response as $relayUrl => $relayResponses) {
        foreach ($relayResponses as $relayResponse) {
            var_dump($relayResponse);
        }
    }
} catch (Exception $e) {
    print 'Exception error: ' . $e->getMessage() . PHP_EOL;
}
```

The output is a multidimensional array with relay responses.
Each relay response contains an array with received messages from the relay.

## Prerequisites
* PHP 8.1 or higher
* [Composer](https://getcomposer.org/)

## Installation

Nostr-PHP can be installed as a package with Composer in your PHP project.

```bash
composer require nostrverse/nostr-php
```

## Usage

Please have a look at the [examples page](/examples) to see how the library can be used.