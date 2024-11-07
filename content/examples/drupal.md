---
Title: Drupal examples with Nostr-PHP
---

# Drupal

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

Now we have a controller, we can start to writing some code with the Nostr-PHP library.

```php

```

## Enable the module

```bash
drush en your_module
```