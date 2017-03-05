// --nodiscover make sure the blockchain is not dicoverable to anybody
// LOCATION OF GENESIS block file /home/patrick/lighthouse/ePrescription/ethereumCode/customBlockchain
// LOCATION OF CHAIN DATA /home/patrick/chain
// --maxpeers 1 // only 1 peer in the network


/*

THIS COMMAND initializes the blockchain, the genesis block
geth --identity "MyNodeName" --rpc --rpcport "8080" --rpccorsdomain "*" --datadir "/home/patrick/TestChain1/chain" --port "30303" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1999 init /home/patrick/lighthouse/ePrescription/ethereumCode/customBlockchain/CustomGenesis.json

THis one runs it and lets you interact with it

geth --identity "MyNodeName" --rpc --rpcport "4000" --rpccorsdomain "*" --datadir "/home/patrick/TestChain1/chain" --port "30303" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1999 console

*/

TO MIGRATE SOMETHING TO THE TESTNETWORK:

1) unlock first account (password is password)
2) Start mining
3) Get going and deploy baby!

Right now the contract lives in 0xcbd99df91c9a8e481629568ad2ce7da68d7429b4
THe unlock account is timed, look at ways to go around this


// --rpcapi "db,eth,net,web3" // By default geth enables all API’s over the IPC interface and only the db,eth,net and web3 API’s over the RPC interface.


// --rpcport "8080"
// Change 8000 to any port that is open on your network. The default for geth is 8080 and althzero is 8545.

/*--rpccorsdomain "*"
This dictates what URLs can connect to your node in order to perform RPC client tasks.
 Be very careful with this and when possible,
 put a specific URL rather than the wildcard (*) which allows any URL to connect to your RPC instance.*/

/*--datadir "/home/HudsonChain1"*/


/*--port "30303"
This is the "network listening port", which you will use to connect with other peers manually.
--nat "any"
I use the NAT any setting, but this will be dependent on your network configuration.*/


/* IPC MEANS interprocess communication
Interprocess communication is a set of programming interfaces  that allow a programmer  to coordinate activities  amon
different program processes that can run concurrently in an OS. This allows a program to handle many user
 requests at the same time. Since even a single user request may result in multiple processes running
 in the operating system on the user's behalf, the processes need to communicate with each other.
 The IPC interfaces make this possible. Each IPC method has its own advantages
 and limitations so it is not unusual for a single program to use all of the IPC methods.
*/

// RPC means remote procedural call
/* RPC is a protocol that one program can use to request a service from a program
located in another computer on a ntwork without having to understand the networks details
A procedure call is also sometimes known as a function call or a subroutine call.

RPC (JSON OR XML RPC)is a protocol of an API
REST is another one


REST is all about a client-server relationship, where server-side data are made
 available through representations of data in simple formats, often JSON and XML.
 These representations for resources, or collections of resources, which are then potentially modifiable,
  with actions and relationships being made discoverable via a method known as hypermedia.
  Hypermedia is fundamental to REST, and is essentially just the concept of providing links to other resources. */

