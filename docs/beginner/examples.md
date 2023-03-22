# Examples

## PHP Examples

### Creating a wallet
```php
<?php

// ---- SETTING ARCADIA NODE ADDRESS ----
// enable_control=true must be set in the data/config-node.toml
// address = "::ffff:127.0.0.1" should be set in the config-rpc.toml
// Make sure no one else has access to the node or they can withdraw funds!
DEFINE('NODE_ADDRESS', '127.0.0.1:7046');

function curl ($post) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, NODE_ADDRESS);
	curl_setopt($ch, CURLOPT_HEADER, 1); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-length: '.strlen($post)));

	$output = curl_exec($ch);
	curl_close($ch);
	
	return $output;
}


/////////////
//// CREATE A NEW USER WALLET

// 1) Generate a key
$post = '{"action": "key_create"}';
$key = json_decode(curl($post));
var_dump($key->private);
var_dump($key->public);
var_dump($key->account);

// 2) Create a new wallet
$post = '{"action": "wallet_create"}';
$wallet = json_decode(curl($post));
var_dump($wallet->wallet);

// 3) Add the generated private key to the wallet
$post = '{"action": "wallet_add", "wallet": "'.$wallet->wallet.'", "key": "'.$key->private.'"}';
$account = json_decode(curl($post));
var_dump($account->account);

//// ---------- YOU HAVE SUCCESSFULLY CREATED A WALLET --------------

?>
```



### Receiving a transaction
```php
<?php

// ---- SETTING ARCADIA NODE ADDRESS ----
// enable_control=true must be set in the data/config-node.toml
// address = "::ffff:127.0.0.1" should be set in the config-rpc.toml
// Make sure no one else has access to the node or they can withdraw funds!
DEFINE('NODE_ADDRESS', '127.0.0.1:7046');

function curl ($post) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, NODE_ADDRESS);
	curl_setopt($ch, CURLOPT_HEADER, 1); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-length: '.strlen($post)));

	$output = curl_exec($ch);
	curl_close($ch);
	
	return $output;
}

// After someone sent you NANO it's in a pending/receivable state until it's being confirmed by the recipient

// Get a list of receivable transactions
$post = '{"action": "receivable", "account": "adia_1111111111111111111111111111111111111111111111111117353trpda"}';
$receivable = json_decode(curl($post));
var_dump($receivable);

// Receive every transaction
if(isset($receivable->blocks) && !empty($receivable->blocks))
{
	foreach($receivable->blocks as $block)
	{
		$post = '{"action": "receive_pending", "wallet": "000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F", "account": "adia_1111111111111111111111111111111111111111111111111117353trpda", "block": "'.$block.'"}';
		$result = json_decode(curl($post));
		var_dump($result);
	}
}
```



### Sending a transaction
```php
<?php

// ---- SETTING ARCADIA NODE ADDRESS ----
// enable_control=true must be set in the data/config-node.toml
// address = "::ffff:127.0.0.1" should be set in the config-rpc.toml
// Make sure no one else has access to the node or they can withdraw funds!
DEFINE('NODE_ADDRESS', '127.0.0.1:7046');

function curl ($post) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, NODE_ADDRESS);
	curl_setopt($ch, CURLOPT_HEADER, 1); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-length: '.strlen($post)));

	$output = curl_exec($ch);
	curl_close($ch);
	
	return $output;
}

// Sending a transaction
$from_wallet = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
$from_account = 'adia_1111111111111111111111111111111111111111111111111117353trpda';
$amount = 100000000000; // amount in raw
$to_account = 'adia_2222222222222222222222222222222222222222222222222227353trpda';
$uniq_id = 'uniq_tx_1'; // change the uniq id with every tx

$post = '{"action": "send", "wallet":"'.$from_wallet.'", "source":"'.$from_account.'", "destination":"'.$to_account.'", "amount":"'.$amount.'", "id": "'.$uniq_id.'"}';
$result = json_decode(curl($post));
var_dump($result);
```

### Misc
```php
<?php

// ---- SETTING ARCADIA NODE ADDRESS ----
// enable_control=true must be set in the data/config-node.toml
// address = "::ffff:127.0.0.1" should be set in the config-rpc.toml
// Make sure no one else has access to the node or they can withdraw funds!
DEFINE('NODE_ADDRESS', '127.0.0.1:7046');

function curl ($post) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, NODE_ADDRESS);
	curl_setopt($ch, CURLOPT_HEADER, 1); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-length: '.strlen($post)));

	$output = curl_exec($ch);
	curl_close($ch);
	
	return $output;
}


/////////////
//// OTHER THINGS YOU CAN DO

// This is how you can see how many blocks the node is behind and if it has syncronized completely
$post = '{"action": "block_count"}';
$block_count = json_decode(curl($post));
var_dump($block_count);

// Check balance
$post = '{"action": "account_balance", "account":"adia_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}';
$balance = json_decode(curl($post));
var_dump($balance->balance);
var_dump($balance->pending);

// List accounts
$post = '{"action": "account_list", "wallet": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}';
$account_list = json_decode(curl($post));
var_dump($account_list->accounts);

?>
```

### Raw Conversion Helper

Here's a script that helps with the conversion of RAW into ADIA and vice-versa

```php
<?php
	class ArcadiaHelperException extends Exception{}
	class ArcadiaHelper
	{
		// *
		// *  Constants
		// *
		
		const RAWS = [
			 'ADIA' =>     '10000000000000000000000000000000000'
			 'PAW' =>     '1000000000000000000000000000'
			 'NANO' =>    '1000000000000000000000000000000',
		];
		
		const PREAMBLE_HEX = '0000000000000000000000000000000000000000000000000000000000000006';
		const EMPTY32_HEX  = '0000000000000000000000000000000000000000000000000000000000000000';
		const HARDENED     =  0x80000000;
		   
		
		// *
		// *  Denomination to raw
		// *
		
		public static function den2raw($amount, string $denomination): string
		{
			if (!array_key_exists($denomination, self::RAWS)) {
				throw new ArcadiaHelperException("Invalid denomination: $denomination");
			}
			
			$raw_to_denomination = self::RAWS[$denomination];
			
			if ($amount == 0) {
				return '0';
			}
			
			if (strpos($amount, '.')) {
				$dot_pos = strpos($amount, '.');
				$number_len = strlen($amount) - 1;
				$raw_to_denomination = substr($raw_to_denomination, 0, -($number_len - $dot_pos));
			}
			
			$amount = str_replace('.', '', $amount) . str_replace('1', '', $raw_to_denomination);
			
			// Remove useless zeros from left
			while (substr($amount, 0, 1) == '0') {
				$amount = substr($amount, 1);
			}
			
			return $amount;
		}


		// *
		// *  Raw to denomination
		// *
		
		public static function raw2den(string $amount, string $denomination): string
		{
			if (!array_key_exists($denomination, self::RAWS)) {
				throw new ArcadiaHelperException("Invalid denomination: $denomination");
			}
			
			$raw_to_denomination = self::RAWS[$denomination];
			
			if ($amount == '0') {
				return 0;
			}
			
			$prefix_lenght = 39 - strlen($amount);
			
			$i = 0;
			while ($i < $prefix_lenght) {
				$amount = '0' . $amount;
				$i++;
			}
			
			$amount = substr_replace($amount, '.', -(strlen($raw_to_denomination)-1), 0);
		
			// Remove useless zeroes from left
			while (substr($amount, 0, 1) == '0' && substr($amount, 1, 1) != '.') {
				$amount = substr($amount, 1);
			}
		
			// Remove useless decimals
			while (substr($amount, -1) == '0') {
				$amount = substr($amount, 0, -1);
			}
			
			// Remove dot if all decimals are zeros
			if (substr($amount, -1) == '.') {
				$amount = substr($amount, 0, -1);
			}
		
			return $amount;
		}
		
		
		// *
		// *  Denomination to denomination
		// *
		
		public static function den2den($amount, string $denomination_from, string $denomination_to): string
		{
			if (!array_key_exists($denomination_from, self::RAWS)) {
				throw new ArcadiaHelperException("Invalid source denomination: $denomination_from");
			}
			if (!array_key_exists($denomination_to, self::RAWS)) {
				throw new ArcadiaHelperException("Invalid target denomination: $denomination_to");
			}
			
			$raw = self::den2raw($amount, $denomination_from);
			return self::raw2den($raw, $denomination_to);
		}
	}
	
?>
```

#### Usage example

```php
<?php

// Include Conversion Helper
include('adia_conversion_helper.php');

// From RAW to ADIA
ArcadiaHelper::raw2den(100000000000000, 'ADIA')

// From ADIA to RAW
ArcadiaHelper::den2raw(1000, 'ADIA')

?>
```