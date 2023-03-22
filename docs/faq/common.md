# Frequently Asked Questions

## Non responsiveness

There's a proof of work component with every TX.

When sending and receiving a tx the nodes generates work which can cause the node to appear frozen or non-responsive.

Ideally an external worker is being run that utilizes the GPU for the work generation of every transaction.

Additional workers and machines that do the work generation can be set in the config-node.toml

## Wallet /  Account / Private Key

Can I create multiple accounts with a key? No every private key created with key_create is one Arcadia (adia_1231..) account.

One wallet can hold thousands of private keys. Using one wallet for every account is not good practice.

Using one wallet for many accounts is good practice.

## High CPU usage

High CPU usage stems from proof of work generations after every send or receive command.

## Public node vs private node

Should you intend to handle sensitive data or use sensitive actions like send, receive etc. then always use your own node.

If you just want to display generic data that is not linked to any sensitive data internally a public node can be used without security concerns.