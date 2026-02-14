const mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide name"]
	},
	ppmId: {
		type: Number,
		required: [true, "Please provide PPM ID"]
	},
	link: {
		type: String,
		required: [true, "Please provide link"]
	},
	age: {
		type: Number,
		required: [true, "Please provide age"]
	},
	price: {
		type: Number,
		required: [true, "Please provide price"]
	},
	type: {
		type: String,
		required: [true, "Please provide type"]
	},
	prk: {
		type: Number,
		required: [true, "Please provide prk"]
	},
	att1: {
		type: Number,
		required: [true, "Please provide att1"]
	},
	att2: {
		type: Number,
		required: [true, "Please provide att2"]
	},
	cz: {
		type: Number,
		required: [true, "Please provide cz"]
	},
	tradedAt: {
		type: Date,
		required: [true, "Please provide tradedAt"]
	}
})

module.exports = mongoose.model("Employee", EmployeeSchema)
