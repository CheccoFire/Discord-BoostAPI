var http = require('http');
var express = require("express");
var app = express();
var Discord = require('discord.js');
var config = require('./config.json')
var client = new Discord.Client();
var port = config.api_port;
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Web Site online, at port: ${port}`)
})
client.on("ready", () => {
    console.log(`Discord Bot online, logged in as ${client.user.tag}!`);
});

app.get("/", async (_req, res) => {
    return res.json({ "status": "Started"})
});

app.get("/discord/", async (_req, res) => {
    var guild = await client.guilds.cache.get(config.discord_guild);
    return res.json({ "status": "Started", "guild_name": guild.name, "guild_id": guild.id })
});


app.get("/discord/checkboost", (req, res) => {
    if (req.query.key != config.api_passwd) { 
        return res.json({ "status": "Error", "code_error": "401", "str_error":"Unauthorized" })
    }
    if (!req.query.key || !req.query.userid) { 
        return res.json({"status": "Error", "code_error": "400", "str_error": "Bad Request" })
    }
    client.guilds.cache.get(config.discord_guild).members.fetch(req.query.userid).then(m => {
        if (m.premiumSince === null) return res.json({ "status": "Success", "isBooster": false })
        if (m.premiumSince) return res.json({ "status":"Success", "isBooster": true, "boosterSince": m.premiumSince })
    })});


client.login(config.discord_token);
