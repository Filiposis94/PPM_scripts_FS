const mongoose = require("mongoose")

const TeamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide name"]
	},
	ppmId: {
		type: Number,
		required: [true, "Please provide PPM ID"]
	},
	league: {
		type: String,
		required: [true, "Please provide league"]
	},
	powers: {
		type: Array,
		required: [true, "Please provide powers"]
	}
})

module.exports = mongoose.model("Team", TeamSchema)
