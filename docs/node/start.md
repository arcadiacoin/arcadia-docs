---
title: Start running a node
description: Reference on how to get started on running an Arcadia node
sidebarDepth: 2
---

# Start

This is a summary on how to get started running and using a Arcadia node.


## Install

Build Arcadia from source or get the latest linux build from:

https://github.com/arcadiacoin/arcadia-node/releases

## Adjusting config

First create a blank config file:
```
./arcadia_node --generate_config rpc > config-rpc.toml
./arcadia_node --generate_config node > config-node.toml
mkdir ~/Arcadia/
mv config-rpc.toml ~/Arcadia/config-rpc.toml
mv config-node.toml ~/Arcadia/config-node.toml
```

To enable RPC control uncomment and modify the following 2 lines in ~/Arcadia/config-rpc.toml

```
address="::ffff:127.0.0.1"
enable_control = true
```

as well as the following line under the [RPC] category in ~/Arcadia/config-node.toml

```
enable = true
```


To have the node automatically receive ADIA the receive_minimum needs be uncommented and set in ~/Arcadia/config-node.toml with:
```
receive_minimum = "10000000000000000000000000000000"
```
this would set the minimum amount to 0.01 ADIA ( amount is the RAW unit ). Any incoming transaction with a lower amount will not be received.

## Ports

The port 7046 should be blocked from the outside on the firewall. Enabling RPC controls allows everyone to control the node and access wallets. Binding it to the local IP 127.0.0.1 should prevent outside access but changes to the config by accident or other reasons can expose the RPC access to the node and pose a security risk.

The port 7045 should be open. That's the peering port.

## Start

Start the node as a daemon with:
```
./arcadia_node --daemon
```

or to have it run in the background:
```
./arcadia_node --daemon > /dev/null 2> /dev/null &
```


## RPC examples

### Total block count of the ledger:
```
curl -d '{ "action" : "block_count" }' 127.0.0.1:7046
```

### Sync status and and network information:
```
curl -d '{ "action" : "telemetry" }' 127.0.0.1:7046
```

### Validate account number / address:
```
curl -d '{ "action" : "validate_account_number", "account": "adia_1mdtea7kixj8w4at35igo17mqbdub3gfouumwbhqmqgzmepwjz67h96piegb" }' 127.0.0.1:7046
```

### Check balance:
```
curl -d '{ "action" : "account_balance", "account": "adia_1mdtea7kixj8w4at35igo17mqbdub3gfouumwbhqmqgzmepwjz67h96piegb" }' 127.0.0.1:7046
```

### Account history:
```
curl -d '{ "action" : "account_history", "account": "adia_1mdtea7kixj8w4at35igo17mqbdub3gfouumwbhqmqgzmepwjz67h96piegb" }' 127.0.0.1:7046
```

### Details on a transaction (block):
```
curl -d '{ "action": "block_info", "json_block": "true", "hash": "87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9" }' 127.0.0.1:7046
```

### Convert from ADIA to the RAW unit:
```
curl -d '{ "action" : "raw_to_adia", "amount": "10000000000000000000000000000000" }' 127.0.0.1:7046
```

### Convert from RAW to the ADIA unit:
```
curl -d '{ "action" : "adia_to_raw", "amount": "10000" }' 127.0.0.1:7046
```

## Sending a transaction


### 1) A wallet is needed
```
curl -d '{ "action": "wallet_create"}' 'http://127.0.0.1:7076'
```
this will create a new wallet and return a wallet ID

### 2) Backing up the wallet seed with:
```
./arcadia_node --wallet_decrypt_unsafe --wallet E3E67B1B3FFA46F606240F1D0B964873D42E9C6D0B7A0BF376A2E128541CC446
```
this will return the wallet seed

### 3) An account needs to be created
```
curl -d '{ "action": "account_create", "wallet": "E3E67B1B3FFA46F606240F1D0B964873D42E9C6D0B7A0BF376A2E128541CC446" }' 'http://127.0.0.1:7076'
```
this will create and return a new account ( adia address )

### To send a transaction:
```
curl -d '{ "action": "send", "wallet": "343EB24C735CCF60E12B9BD4EA70226519F438E0E9A8D1EDB4D2DE8E74D96637", "source": "adia_3n7k4zxf8qif4f9k61if6oimsfdiobfytynmaagx95fwzdcgbct7i3xmndba", "destination": "adia_1yj4r1ocw81pitn1xz5mzxuthne3g4ezfxg9n6sbtzcz6jdtggxo9wxieysx", "amount": "2700000000000000000000000000", "id": "f4c07f4e73fb4091fdb47e0e3bxa" }'  127.0.0.1:7046
```

wallet = the wallet containing the account

source = the account to send ADIA from

destination = the account to send ADIA to

amount = ADIA amount in RAW unit

id = unique identifier for every transaction is required and helps preventing sending a transaction twice by accident


## Receive a transaction


If receive_minimum has been set the node will automatically receive incoming ADIA.

In case you rather want to do it manually or receive ADIA that fall below the "receive_minimum" you can check for receivable ADIA with:
```
curl -d '{"action":"receivable", "account":"adia_1qfe5u7bcm7qrpp9rhk9p7wyqw316om1ts7s4gm466nwy6ueniik1gzwcno8"}' 127.0.0.1:7046
```
this will return a list of incoming ADIA ready to be received ( their block hashes )

Each transaction ( block ) can be received with:
```
curl -g -d '{ "action": "receive", "wallet": "7A684D6DF9852D0826BA208FA2BE4BD673C049992CA229204F0E98B4A89D8F6X", "account": "adia_1mdtea7kixj8w4at35igo17mqbdub3gfouumwbhqmqgzmepwjz67h96piegb", "block": "634BFB577065CDE5C0F6DD2074CC7E28B8D4EE4691B37647852376203C6AED6C" }' 127.0.0.1:7046
```


# Work Generation

Transactions are near instant but each transaction ( receive and send ) requires some Proof-Of-Work to prevent spam transactions within the fee-less nature of the network.

It is recommended to run a dedicated worker that does the work computation and ideally has access to a GPU to speed transactions up:

The worker server can be found here:

https://github.com/nanocurrency/nano-work-server

After running the nano-work-server it listens for incoming work requests and must be added to the config-node.toml as a work peer.
```
work_peers = ["192.168.4.10:7000"]
```

Not running a dedicated worker can have the node become unresponsive for duration it sends or receives a transaction.

Running a dedicated worker is optional but something to be considered if the amount of incoming and outgoing transactions is getting too high.


# Masternode

It's recommended to run the node as a voting node ( masternode ). Voting nodes tend receive broadcasted transactions faster than non-voting ones when they have 0.1% of the total ADIA supply delegated to them but voting can take up more CPU resources.

To have the node act also as a voting node uncomment and set the following line in ~/Arcadia/config-node.toml:
```
enable_voting = true
```


___

Another source for further documentation is at:

https://docs.nano.org/ ( the crypto-currency Arcadia derived of )

Documentation on how to to build from source can also be taken from here but needs to be slightly adjusted to work with Arcadia (e.g. the github source used for build):
https://docs.nano.org/integration-guides/build-options/