module.exports = function(RED) {
    function RigRunnerServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
    }
    RED.nodes.registerType("rigrunner-server",RigRunnerServerNode);
}