# Execute async concurrent requests

Choosing the right software package to enable a new feature in your code can be hard task. You’re adding a dependency which always comes with risks and trade-offs.

PHP was very late to the party offering an out-of-the-box solution for handling async requests in parallel (also called concurrency). PHP 8.1 was released in november 2021 and offers a new feature called Fibers.

> Fibers are primitives for implementing lightweight cooperative concurrency. They are a means of creating code blocks that can be paused and resumed like Generators, but from anywhere in the stack. Fibers themselves don't magically provide concurrency, there still needs to be an event loop. However, they allow blocking and non-blocking implementations to share the same API.
>
> Fibers allow getting rid of the boilerplate code previously seen with `Promise::then()` or Generator based coroutines. Libraries will generally build further abstractions around Fibers, so there's no need to interact with them directly.  
> Source: https://www.php.net/releases/8.1/en.php#fibers

Solutions found:

| 	URL                                                            | 	Pros                                                                                                                                                           | 	Cons                                                           |	Websockets |
|-----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|----|
| [Guzzle](https://github.com/valtzu/guzzle-websocket-middleware) | Uses Guzzle! The most used PHP HTTP client. Only three files for using a middleware solution for handling websocket requests.	Relative new and not used by many | Needs 8.2 and does not work with 8.1.                           |	✅ |
| [Revolt](https://revolt.run/)  | Collaboration initiative between AMPHP and ReactPHP 		                                                                                                          | Low-level, Lean, It uses PHP fibers which is new since 8.1 Fast | ❌ |
| [ReactPHP](https://reactphp.org/)	                              |                                                                                                                                                                 | 	Low-level, Feels outdated	                                     | ✅ |    
| [AMPHP](https://github.com/amphp)	                              | Huge adoption for v2                                                                                                                                            | Lack of documentation for v3, v3 is relative new                |	✅ |
| [Open Swoole](https://openswoole.com/)                          | 	Absolutely fast                                                                                                                                                | There is a PECL available,	Relative new                         | 	✅ |
| [spatie/async](https://github.com/spatie/async)                 | 	Easy to use                                                                                                                                                    | 	                                                               |	❌ |
| [PPM](https://github.com/php-pm/php-pm)                         | 		Outdated                                                                                                                                                      |                                                                 | |                  
| [FrankenPHP](https://frankenphp.dev/)                           | 		No async support (yet)                                                                                                                                        |                                                                 | |     
| [php-wss](https://github.com/arthurkushman/php-wss)             | Includes a client and server implementation                                                                                                                     |                                                                 |                        

## Considerations while choosing an solution for supporting concurrency requests in Nostr-PHP

- Using a low-level package (Revolt, ReactPHP) is better than a framework (Open Swoole, AMPHP)
- Fewer dependencies is better, so the codebase stays as small as possible
- Writing native PHP async concurrent requests with fibers is something to consider in the future if we’re struggling with the choosen package.
- The chosen package should support websockets, so we handle the requests relay requests through a websocket client in Nostr-PHP.

| Package            | 	Release | First commit | # contributors | # open issues | # stars | 	# installs | # dependencies | Date noted  |
|--------------------|----------|--------------|----------------|---------------|---------|-------------|----------------|-------------|
| revolt/event-loop	 | 1.0.6    | 25-07-2021	  | 12             | 	5            | 	786    | 	6.699.383	 | 10             | 	19-08-2024 | 
| amphp/amp	         | 3.0.2	   | 04-08-2013   | 	44            | 	15           | 	4.186  | 	69.818.475 | 	13            | 	19-08-2024 |
| react/event-loop	  | 1.0.5    | 	29-04-2012  | 	35            | 	2            | 	1231   | 	59.180.077 | 	4             | 	20-08-2024 | 
| openswoole/core    | 	22.1.15 | 	19-12-2021  | 	10            | 	41	          | 344	    | 334.441     | 	71            | 	19-08-2024 |
| [valtzu/guzzle-websocket-middleware](https://github.com/valtzu/guzzle-websocket-middleware)		  | 0.2.0	   | 09-05-2024   | 5	             | 1             | 	0      | 29          | 1              | 04-10-2024  |
| [php-wss](https://github.com/arthurkushman/php-wss) | 2.0.5 | 22-11-2015   | 4              | 7             | 209     | 720.885     | 5              | 04-10-2024  |

## Some insights

- AMPHP v3 uses Revolt as a dependency for event loops - source: https://github.com/amphp/amp/issues/428
- ReactPHP and AMPHP are similar and both async framework
- Revolt seems to be up-to-date and is easier in use
- Open Swoole is relative new and also had some drama in the past
- For a solid, low-level integration ReactPHP seems to be the right dependency
- My expectation the adoption Revolt will increase and is the best option for the future. It’s also much leaner compared to ReactPHP as it’s using the new fibers feature since PHP 8.1. As far as I researched and found, there is no support in the package for websockets (yet). Here we could use https://github.com/ratchetphp/Pawl which is a websocket client supporting concurrency.

## Other resources

- https://themsaid.com/asynchronous-php
- https://www.squash.io/tutorial-implementing-asynchronous-code-in-php/
- https://github.com/elazar/asynchronous-php
- https://www.youtube.com/shorts/oVKvfMYsVDw
- https://aoeex.com/phile/php-fibers-a-practical-example/
- https://stitcher.io/blog/asynchronous-php
- https://ascend-agency.medium.com/async-or-swim-evolution-asynchronous-php-non-blocking-code-execution-c75b285b2bbb
- https://www.drupal.org/project/drupal/issues/3257726
- https://mglaman.dev/blog/can-we-use-concurrency-speed-streamed-bigpipe-responses-drupal
- https://gorannikolovski.com/blog/asynchronous-and-concurrent-http-requests-in-php