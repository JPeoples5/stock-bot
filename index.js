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
			let price = res["Global Quote"]["05. price"].slice(0, -2) //remove extra 00
			let changePercent = res["Global Quote"]["10. change percent"]
			message.reply(`$${price}  (${changePercent})`)
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
		return "Invalid ticker symbol"
	}
}

function isValidTickerSymbol(message) {
	if (message.author.bot) return false
	if (message.content.charAt(0) != "$") return false
	if (2 > message.content.length) return false
	if (message.content.length > 6) return false
	if (containsNumber(message.content)) return false

	return true
}

function containsNumber(_string) {
	return /\d/.test(_string)
}

client.login(process.env.MY_TOKEN)
