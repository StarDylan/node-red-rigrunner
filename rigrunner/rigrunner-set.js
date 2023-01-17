const axios = require('axios');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

module.exports = function(RED) {
    function RigRunnerSet(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', async function(msg) {
            
            var server = RED.nodes.getNode(config.server);
            var response = await setRigRunnerOutput(server.host, config.rigrunnerdeviceidx, config.devicevalue, node);
            if (response != null){   
                node.send(msg);
            }
        });

    }
    RED.nodes.registerType("rigrunner-set",RigRunnerSet);
}

// Output num starts at 1
async function setRigRunnerOutput(hostname, output_num, value, node_ctx) {
    
    output_num = output_num -1
    try {
		const response = await axios.get(
			'http://' + hostname + '/sensors.xml', 
            {timeout: 900}
		)

        const parser = new XMLParser()
        sensorData = parser.parse(response.data)

        if (sensorData["dcrmcu_signals"]["av_scaled" + output_num].includes('OFF') && value == "off") {
            
            node_ctx.status({fill:"green",shape:"dot",text:"Already Off"})
            return "Already Off";
        } else if ((!sensorData["dcrmcu_signals"]["av_scaled" + output_num].includes('OFF')) && value == "on") {
            
            node_ctx.status({fill:"green",shape:"dot",text:"Already On"})
            return "Already On"
        }

	} catch (error) {
        node_ctx.error("Failed to connect to RigRunner!\n\n" + error)
        node_ctx.status({fill:"red",shape:"ring",text:"unable to connect"})
		return null;
	}

    try {
        const response = axios.request({
            method: 'post',
            url: 'http://' + hostname + '/sensors.xml',
            data: 'DIGOUT_TOGGLE=' + (1 << output_num),
            timeout: 900
        });
	} catch (error) {
        node_ctx.error("Failed to set output on RigRunner!\n\n" + error)
        node_ctx.status({fill:"red",shape:"ring",text:"unable to connect"})
		return null;
	}

    
    node_ctx.status({fill:"green",shape:"dot",text:"Set Status!"})
    return "Success!";
}