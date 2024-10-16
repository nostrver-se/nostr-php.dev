# Asynchronous and concurrent requests

#### Problem
PHP is primarily a synchronous language, meaning that each line of code is executed sequentially, with each subsequent line waiting for the previous one to complete.
Consider, for example, the need to execute five independent requests to one relay. In this situation, we send the first request and wait for its response, then proceed to send the second request and wait again, continuing this pattern through all five requests. This process is time-consuming and less efficient than necessary.
This get even more complicated when we have multiple relays we're connecting to with one or more requests. 

Research outcomes how to do async, concurrent websocket requests: [/references/async-concurrent-requests](/references/async-concurrent-requests)

## Solution 

@todo

## Full snippet doing async, concurrent requests with the Http/Guzzle client

Make sure you've added the `valtzu/guzzle-websocket-middleware` package with composer 

```bash
composer require valtzu/guzzle-websocket-middleware
````

The code:

```php
<?php

declare(strict_types=1);

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Handler\StreamHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Response;
use swentel\nostr\Filter\Filter;
use swentel\nostr\Message\RequestMessage;
use swentel\nostr\Relay\Relay;
use swentel\nostr\Relay\RelaySet;
use swentel\nostr\Subscription\Subscription;
use Valtzu\WebSocketMiddleware\WebSocketMiddleware;

require __DIR__ . '/vendor/autoload.php';

/**
 * Connect to WebSocket endpoints with Guzzle HTTP client
 * https://github.com/valtzu/guzzle-websocket-middleware
 *
 * Only works with PHP >8.2
 */

try {
    $handlerStack = new HandlerStack(new StreamHandler());
    $handlerStack->push(new WebSocketMiddleware());
    $guzzle = new Client(['handler' => $handlerStack]);

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

    // Let's create a RelaySet
    $relaySet = new RelaySet();
    $relaySet->setRelays($relays);
    // Create the request message to broadcast to this RelaySet.
    $reqMsg = populateRequestMessage();
    $payload = $reqMsg->generate();
    $relaySet->setMessage($reqMsg);

    /** @var Closure $relaySetAsyncRequests */
    $relaySetAsyncRequests = function (RelaySet $relaySet) use ($guzzle) {
        $relays = $relaySet->getRelays();
        $countOfRelaysInRelaySet = count($relays);
        for ($i = 0; $i < $countOfRelaysInRelaySet; $i++) {
            /** @var Relay $relay */
            $relay = $relays[$i];
            $uri = $relay->getUrl();
            yield function () use ($guzzle, $uri) {
                return $guzzle->getAsync($uri);
            };
        }
    };

    /** @var GuzzleHttp\Pool $pool */
    $pool = new Pool($guzzle, $relaySetAsyncRequests($relaySet), [
        'concurrency' => 20, // Maximum number of requests to send concurrently.
        'options' => [], // Array of request options to apply to each request to the client ($guzzle), see https://docs.guzzlephp.org/en/stable/request-options.html.
        'fulfilled' => function (Response $response, $index) {
            // this is delivered each successful response
            /** @var \Valtzu\WebSocketMiddleware\WebSocketStream $ws */
            $ws = $response->getBody();
            $uri = $ws->getMetadata('uri');
            if ($response->getStatusCode() !== 101) {
                echo $uri . ': ' . $response->getReasonPhrase() . PHP_EOL;                
            } else {
                // Handle our websocket request here.
                $reqMsg = populateRequestMessage();
                $payload = $reqMsg->generate();
                echo 'Writing to ' . $uri . ':' . PHP_EOL;
                echo $payload . PHP_EOL;
                $ws->write($payload);
                do {
                    $ws_content = $ws->read();
                    if ($ws_content !== '') {
                        echo 'Response from: ' . $uri . PHP_EOL;
                        echo $ws_content . PHP_EOL;
                        echo '-----------------------------------------------' . PHP_EOL;
                    }
                } while ($ws_content === '');
            }
        },
        'rejected' => function (RequestException $reason, $index) {
            // this is delivered each failed request
            var_dump($reason);
        },
    ]);

    // Initiate the transfers and create a promise
    /** @var GuzzleHttp\Promise\Promise $promise */
    $promise = $pool->promise();

    // Force the pool of requests to complete.
    $promise->wait();

    if ($promise->getState() === 'fulfilled') {
        // We're done.
    } else {
        // get reason
        throw new RuntimeException(sprintf('Promise is not fulfilled, but: %s', $promise->getState()));
    }

}

function populateRequestMessage(): RequestMessage
{
    $subscription = new Subscription();
    $subscriptionId = $subscription->setId();
    $filter1 = new Filter();
    $filter1->setAuthors(
        [
            'npub1qe3e5wrvnsgpggtkytxteaqfprz0rgxr8c3l34kk3a9t7e2l3acslezefe',
        ],
    );
    $filter1->setKinds([1, 30023]);
    $filter1->setLimit(1);
    $filters = [$filter1];
    return new RequestMessage($subscriptionId, $filters);    
}

```

