/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-23 11:21:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-23 11:51:45
 * @Description: 
 */
const express = require("express");

module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	// Called after broker started.
	started(broker) {
		broker.createService(require("@steedos/service-enterprise"));

		const svc = broker.createService(require("@steedos-labs/experience"));

		const app = express();

		app.use("/", svc.express());
		
		app.use("/", express.static(svc.static(), { maxAge: svc.cacheTime() }));

		app.listen(3333, err => {
			if (err)
				return console.error(err);
		
			console.log("Open http://localhost:3333");
		});
	},

};
