require("dotenv").config()
const Discord = require("discord.js")

// client is stock bot
const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES"],
})
client.login(process.env.MY_TOKEN)

client.on("ready", () => {
	console.log(`${client.user.tag} is alive and awake`)
})

client.on("messageCreate", (message) => {
	if (message.content.toUpperCase() == "$VOO") {
		message.reply("$405.90")
	}
})
