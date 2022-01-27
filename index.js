require("dotenv").config()
const axios = require("axios")
const Discord = require("discord.js")

// client is stock bot
const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES"],
})

client.on("ready", () => {
	console.log(`${client.user.tag} is alive and awake`)
})

client.on("messageCreate", (message) => {
	if (!isValidTickerSymbol(message)) return
	let ticker = message.content.slice(1).toUpperCase() // remove $ and format to upperCase

	// Create Stock Price Message and reply to the inquiry
	getStockPrice(ticker).then((res) => {
		if (res["Global Quote"]["05. price"]) {
			message.reply(`${res["Global Quote"]["05. price"]}  (${res["Global Quote"]["10. change percent"]})`)
		}
	})
})

async function getStockPrice(ticker) {
	try {
		let res = await axios({
			url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.AV_KEY}`,
			method: "get",
			timeout: 8000,
			headers: {
				"Content-Type": "application/json",
			},
		})
		return res.data
	} catch (err) {
		console.error(err)
		return "invalid ticker symbol"
	}
}

function isValidTickerSymbol(message) {
	if (message.author.bot) return false
	if (2 > message.content.length) return false
	if (message.content.length > 6) return false
	if (message.content.charAt(0) != "$") return false
	if (stringContainsNumber(message.content)) return false

	return true
}

function stringContainsNumber(_string) {
	return /\d/.test(_string)
}

client.login(process.env.MY_TOKEN)
