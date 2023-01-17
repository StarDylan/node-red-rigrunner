const axios = require('axios');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

module.exports = function(RED) {
    function RigRunnerGet(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', async function(msg) {
            var server = RED.nodes.getNode(config.server);
            msg.payload = await getRigRunnerSensors(server.host, node);
            if (msg.payload != null){   
                node.send(msg);
            }
        });

    }
    RED.nodes.registerType("rigrunner-get",RigRunnerGet);
}

async function getRigRunnerSensors(hostname, node_ctx) {
	try {
		const response = await axios.get(
			'http://' + hostname + '/sensors.xml', 
            {timeout: 900}
		)

        const parser = new XMLParser()
        sensorData = parser.parse(response.data)

        parsedAmps = Array(10).fill(0).map((_, i) =>  {
            // Determines if output is set to OFF
            if (sensorData["dcrmcu_signals"]["av_scaled" + i].includes('OFF')) {
                return 0.0;
            }
           return parseFloat(sensorData["dcrmcu_signals"]["av_scaled" + i].match(/^[0-9]\d*(\.\d+)/)[0]);
        });

        supplyVoltage = parseFloat(sensorData["dcrmcu_signals"]["av_scaled10"].match(/^[0-9]\d*(\.\d+)/)[0])

        internalTemp = parseFloat(sensorData["dcrmcu_signals"]["int_temp"])/10;
        internalTemp2 = parseFloat(sensorData["dcrmcu_signals"]["int_temp2"])/10;

        node_ctx.status({fill:"green",shape:"dot",text:"connected"});

		return {"outputAmps": parsedAmps, "supplyVoltage": supplyVoltage, "internalTemp": internalTemp, "internalTemp2": internalTemp2};
	} catch (error) {
        node_ctx.error("Failed to connect to RigRunner!\n\n" + error)
        node_ctx.status({fill:"red",shape:"ring",text:"unable to connect"})
		return null;
	}
}
