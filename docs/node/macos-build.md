---
title: MacOS source build
description: How to build PAW node on a MacOS from source
sidebarDepth: 2
---

 # Build instructions for an arm64 (M1) MacOS build
 The following build instructions draw heavily from nano node's build instructions: https://docs.nano.org/integration-guides/build-options/

If needed, install homebrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install cocoapods if not present. (May need to use sudo gem install if using system ruby)
```
gem install cocoapods
```

Install git-lfs
```
 brew install git-lfs
 git lfs install
```

Install cmake
```
brew install cmake
```


 download Boost from here: https://www.boost.org/users/history/version_1_70_0.html
 https://boostorg.jfrog.io/artifactory/main/release/1.70.0/source/boost_1_70_0.tar.gz


extract the tarball and make a note of the location of this folder. I moved mine to ~/code/boost_1_70_0

Run the following commands in your terminal window. It'll take a bit to compile all of the boost libraries. This step compiles arm64 versions of the boost libary used later in the build process.

```
cd ~/code/boost_1_70_0
rm -rf arm64 x86_64 universal stage bin.v2
rm -f b2 project-config*
./bootstrap.sh cxxflags="-arch x86_64 -arch arm64" cflags="-arch x86_64 -arch arm64" linkflags="-arch x86_64 -arch arm64"
./b2 toolset=clang-darwin target-os=darwin architecture=arm abi=aapcs cxxflags="-arch arm64" cflags="-arch arm64" linkflags="-arch arm64" -a
```


Recursively clone paw-node's source code into the paw_build directory
```
 git clone --recursive git@github.com:paw-digital/paw-node.git paw_build
```


Navigate to paw_build directory, export BOOST_ROOT from earlier steps, then compile paw_node.
```
cd ~/code/paw_build
export BOOST_ROOT=~/code/boost_1_70_0
cmake -G "Unix Makefiles" .
make nano_node
cp nano_node ../paw_node && cd .. && ./paw_node --diagnostics
```

congrats! you should now have a working paw_node executable.

You can then use this executable to start up a new node using this slightly modified install script:
Copy paw_node to /usr/local/bin so that it is on your Path and can be called easily from your terminal window.
```
sudo cp ./paw_node > /usr/local/bin/paw_node
sudo chmod +x /usr/local/bin/paw_node
```


Then run the abbreviated install script (save the contents as paw-install.sh, copy/pasting directly into a zsh terminal won't work):
```
#!/bin/sh

#check installs
command -v curl >/dev/null 2>&1 || { echo "Requires curl but it's not installed. Use brew install curl" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Requires jq but it's not installed. Use brew install jq" >&2; exit 1; }

#Create data dir
datadir=~/"Library/Paw"
if [ ! -d $datadir ]
then
    echo "Creating data directory ${datadir}"
    mkdir $datadir
fi

#Generate config for node
config_node_file=$datadir"/config-node.toml"
ip=$(curl -s https://ipinfo.io/ip)
if [ ! -f $config_node_file ]
then
    echo "Creating node config" $config_node_file
    node_config=$(paw_node --generate_config node)
    node_config=$(echo "$node_config" | sed "s/\[rpc\]/[rpc]\n\nenable = true/g")
    node_config=$(echo "$node_config" | sed "s/\#enable_voting\ \=\ false/enable_voting = true/g")
    echo "$node_config" > $config_node_file
fi

#Generate config for rpc
rpc_node_file=$datadir"/config-rpc.toml"
if [ ! -f $rpc_node_file ]
then
    echo "Creating rpc config" $rpc_node_file
    rpc_config=$(paw_node --generate_config rpc)
    rpc_config=$(echo "$rpc_config" | sed "s/\#enable_control\ \=\ false/enable_control = true/g")
    echo "$rpc_config" > $rpc_node_file
fi

#Start daemon
paw_node --daemon --data_path=$datadir > /dev/null  2>&1 &
if [ $? -ne 0 ]
then
  echo "Could not start daemon"
  exit 1
fi
sleep 1

#Create rep account
wallet=$(curl -s -d '{"action": "wallet_create"}' http://localhost:7046 | jq -r '.wallet')
if [ "$wallet" = "null"  ] || [ -z "$wallet" ]
then
    echo "Failed to create wallet"
    exit 1
fi
account=$(curl -s -d "{\"action\": \"account_create\",\"wallet\": \"${wallet}\"}" http://localhost:7046  | jq -r '.account')
if [ "$account" = "null" ] || [ -z "$account" ]
then
    echo "Failed to create account"
    exit 1
fi
echo "Your tribe has been created ${account} please send at least 0.01 PAW to this account to open it. Your tribe will start voting once its open and has over 1000 PAW delegated."

#Disable enable control
rpc_config=$(paw_node --generate_config rpc)
echo "$rpc_config" > $rpc_node_file

#Restart daemon
killall -9 paw_node > /dev/null 2>&1
sleep 5
paw_node --daemon --data_path=$datadir > /dev/null  2>&1 &
if [ $? -ne 0 ]
then
  echo "Could not start daemon"
  exit 1
fi
echo "Node is running"
echo "Node address: ${ip}:7045"
echo "\n====\n"

private_key=$(paw_node --wallet_decrypt_unsafe --wallet=${wallet} | sed "s/\ P/\nP/g")
echo "Please store your private key safely and confidentially!"
echo "${private_key}"
```
