---
Title: Drupal examples with Nostr-PHP
---

# Drupal

This examples provides a basic example how Nostr-PHP can be used in a Drupal project.
It also assumes that you're familiar with creating [custom modules](https://www.drupal.org/docs/creating-custom-modules/step-by-step-tutorial-hello-world) for Drupal.

## Create a custom module in your existing Drupal project

```bash
drush gen module
```

Add a `composer.json` file to your created Drupal module:

```json
{
  "name": "name_of_your_drupal_module",
  "description": "",
  "type": "drupal-module",
  "require": {
    "nostr-php": "^1.4"
  }
}
```

## Create a route with a controller callback 

```bash
drush gen controller
```

This provides us a new endpoint (a route with a URL) which will call our code we're going to write in the controller.
In this controller a controller, we have a method where we can write our PHP code with the Nostr-PHP library.

```php
class myController extends ControllerBase
{
  public function __invoke(Request $request): array 
  {
    return [
      '#markup' => '',
      '#theme' => '',
      '#event' => $event,
    ];
  }
}

```

## Enable the module

```bash
drush en your_module
```

Here is a more detailed example (a custom Drupal module) where the same basics are used as explained on this page:
https://gitlab.com/sebastix-group/nostr/nostrver.se/-/tree/develop/web/modules/custom/njump

This module provides an endpoint at `https://nostrver.se/e/{nostr_event_id}` were a page will be displayed with the requested Nostr event using the event id as an argument used in the request message provided by Nostr-PHP. 