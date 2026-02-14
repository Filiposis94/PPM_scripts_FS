const mongoose = require("mongoose")

const HeaderSchema = new mongoose.Schema({
	rounds: {
		type: Array,
		required: [true, "Please provide rounds"]
	}
})

module.exports = mongoose.model("Header", HeaderSchema)
