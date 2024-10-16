# What is Nostr-PHP?

**Nostr-PHP is a helper library for PHP developers.**

## How it started

Back in february 2023 the initial development of the Nostr-PHP library was done by Swentel while he was working on a Drupal module to easily (cross)post a note ([Nostr Simple Publish](https://www.drupal.org/project/nostr_simple_publish)).
When he started to work on this module he quickly learned that it would make sense do use a PHP helper library to execute all the Nostr generic things in the code. 
As there was no library yet, he started to build one (see the initial commit [here](https://github.com/nostrver-se/nostr-php/commit/9ce143e4d8e63ef955b32d66ad0f0530c01c2794)) to include it in the module (see this [commit](https://git.drupalcode.org/project/nostr_simple_publish/-/commit/cbdb3b50dc7b08a1ee4c033ff04de717c7897f75)). 
In that same period also Sebastix was developing a Drupal module to integrate NIP-05 ([Nostr NIP05](https://www.drupal.org/project/nostr_id_nip05)) and started to use the library as well.
He used the Nostr Simple Publish module to create a new module for crossposting long form content ([Nostr long-form content NIP-23](https://www.drupal.org/project/nostr_content_nip23)).

In June 2023 Swentel was unable to keep working on the library as well on the Nostr Simple Publish Drupal module (see this [issue](https://github.com/nostrver-se/nostr-php/commit/9ce143e4d8e63ef955b32d66ad0f0530c01c2794)). He reached out with the question seeking for other co-maintainers.
In October 2023 Sebastix applied as a maintainer as there was no interest from other developers as he was still working on some Drupal modules.

At the end of 2023 Sebastix applied for a OpenSats grant for further development of the library (read the grant application [here](https://njump.me/naddr1qvzqqqr4gupzqpnrnguxe8qszsshvgkvhn6qjzxy7xsvx03rlrtddr62haj4lrm3qqyrsvnxvd3nyc35r0ppyp)). In May '24 OpenSats approved this grant to Sebastix for a 1-year part-time development till June '25.

## Learn more about websockets

If you're curious how Websocket works, I recommended to watch this video:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2Nt-ZrNP22A?si=l0DUpejXKrB0E21P" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This video is part of https://www.classcentral.com/course/youtube-websockets-crash-course-handshake-use-cases-pros-cons-and-more-139394