/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-23 11:21:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 16:38:49
 * @Description: 
 */
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "info",

	// Called after broker started.
	started(broker) {
		broker.createService(require("@steedos/service-enterprise"));

		broker.createService(require("@steedos-labs/experience"));

	},

};
