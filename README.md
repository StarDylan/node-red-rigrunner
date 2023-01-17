# node-red-rigrunner

[Rigrunner-10100i](http://www.westmountainradio.com/product_info.php?products_id=rr_10010i) controller and status reader for Node-RED.

## Background

This node was created because there was no other node that allows reading status and setting outputs in Node-RED

## Installation

To install the node from the command-line, you can use the following command from within your user data directory (by default, ```$HOME/.node-red```):
```sh
npm install @starink/node-red-rigrunner
```

## Flows
The Rigrunner Get node allows you to access the amperage of each output, the supply voltage for the rigrunner, and the internal temperature sensors.

The Rigrunner Set node allows you to set the output value on each of the 10 different outputs the rigrunner allows for.

## License

Licensed under [Apache](./LICENSE).
