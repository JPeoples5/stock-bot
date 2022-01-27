require("dotenv").config()
const axios = require("axios")
const Discord = require("discord.js")

// client is stock bot
const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES"],
})

client.on("ready", () => {
	console.log(`${client.user.tag} is alive and awake`)
	getStockPrice("VOO").then((res) => console.log(res["Global Quote"]["05. price"]))
})

client.on("messageCreate", (message) => {
	if (message.author.bot) return
	if (2 > message.content.length) return
	if (message.content.length > 6) return

	getStockPrice().then((res) => message.reply(res["Global Quote"]["05. price"]))
})

async function getStockPrice() {
	try {
		let res = await axios({
			url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VOO&apikey=${process.env.AV_KEY}`,
			method: "get",
			timeout: 8000,
			headers: {
				"Content-Type": "application/json",
			},
		})
		return res.data
	} catch (err) {
		console.error(err)
	}
}

client.login(process.env.MY_TOKEN)
