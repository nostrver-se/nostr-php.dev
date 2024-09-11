---
Title: Relay responses
---

# Relay responses

According to [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md#from-relay-to-client-sending-events-and-notices) you can receive the following type of responses of a relay.

* `EVENT` - event JSON as defined above, used to send events requested by clients.
* `OK` - used to indicate acceptance or denial of an EVENT message.
* `EOSE` -  used to indicate the end of stored events and the beginning of events newly received in real-time.
* `CLOSED` - used to indicate that a subscription was ended on the server side.
* `NOTICE` - used to send human-readable error messages or other things to clients.

[NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) provides a `AUTH` type response from the relay which is also supported in this library.