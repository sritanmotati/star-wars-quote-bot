require('dotenv').config()

const fetch = require("node-fetch");

const Discord = require('discord.js')
const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot is online!")
})

client.on("message", msg => {
    switch(msg.content) {
        case "-sw quote":
            fetch('http://swquotesapi.digitaljedi.dk/api/SWQuote/RandomStarWarsQuote')
                .then(response => response.json())
                .then(data => {
                    const message = data.starWarsQuote;
                    let split;
                    if (message.split(' - ').length === 2) {
                        msg.channel.send(`*"${message.split(" - ")[0]}"*`);
                        msg.channel.send(`— ${message.split(" - ")[1]}`);
                        split = ' - ';
                    } else if (message.split(' — ').length === 2) {
                        msg.channel.send(`*"${message.split(" — ")[0]}"*`);
                        msg.channel.send(`— ${message.split(" — ")[1]}`);
                        split = ' — ';
                    } else {
                        msg.channel.send(`*"${message.split(" ? ")[0]}"*`);
                        msg.channel.send(`— ${message.split(" ? ")[1]}`);
                        split = ' ? ';
                    }
                    let gif_url;
                    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_TOKEN}&q=${message.split(split)[1]}&limit=5`)
                        .then(res => res.json())
                        .then(giphy => {
                            // gif_url = giphy.data[0].images.original.mp4;
                            gif_url = giphy.data[0].images.fixed_height.url;
                            msg.channel.send({embed: {
                                image:  {
                                    url: gif_url
                                }
                            }});
                        })
                })
    }
})

client.login(process.env.BOT_TOKEN)