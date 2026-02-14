const mongoose = require("mongoose")

const PlayerSchema = new mongoose.Schema({
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
		type: String,
		required: [true, "Please provide age"]
	},
	sv: {
		type: String,
		required: [true, "Please provide sv"]
	},
	bra: {
		type: Number,
		required: [true, "Please provide bra"]
	},
	obr: {
		type: Number,
		required: [true, "Please provide obr"]
	},
	uto: {
		type: Number,
		required: [true, "Please provide uto"]
	},
	str: {
		type: Number,
		required: [true, "Please provide str"]
	},
	nah: {
		type: Number,
		required: [true, "Please provide nah"]
	},
	tec: {
		type: Number,
		required: [true, "Please provide tec"]
	},
	agr: {
		type: Number,
		required: [true, "Please provide agr"]
	},
	zku: {
		type: Number,
		required: [true, "Please provide zku"]
	},
	prs: {
		type: String,
		required: [true, "Please provide PrS"]
	},
	interestedIn: {
		type: Boolean
	},
	ufaFrom: {
		type: Date,
		required: [true, "Please provide ufaFrom"]
	},
	ufaTo: {
		type: Date,
		required: [true, "Please provide ufaTo"]
	}
})

module.exports = mongoose.model("Player", PlayerSchema)
