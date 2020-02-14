const Discord = require("discord.js");  // Discord
const { token } = require("./settings.json");    // Token and Prefix
const client = new Discord.Client({disableEveryone: true});

client.commands = new Discord.Collection();

//Require handlers
["command","event"].forEach(x => require(`./handlers/${x}`)(client));

client.login(token);
