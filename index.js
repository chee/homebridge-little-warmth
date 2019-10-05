let readline = require("readline")
let {exec} = require("child_process")

let Service, Characteristic, HomebridgeAPI

module.exports = homebridge => {
	Service = homebridge.hap.Service
	Characteristic = homebridge.hap.Characteristic
	homebridge.registerAccessory("homebridge-little-warmth", "LittleWarmth", LittleWarmth)
}

class LittleWarmth {
	constructor (log, config) {
		this.log = log
		this.name = config.name || "Little Warmth"
		this.command = config.command || "get_temperature"

		this.service = new Service.TemperatureSensor(this.name)

		this.service
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on("get", this.getState.bind(this))
	}

	getState (callback) {
		exec(this.command, (error, temp) => {
			this.log(temp)
			this.temp = Number(temp)
			callback(error, this.temp)
		})
	}

	getServices () {
		return [this.service]
	}
}
