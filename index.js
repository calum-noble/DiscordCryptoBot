const Discord = require('discord.js');
const { cpuUsage } = require('process');
const client = new Discord.Client();
const prefix = "!";



client.once('ready', () => {
	console.log('Ready!');
});

client.login(' DISCORD BOT TOKEN HERE ');

client.on("message", function(message) {
    if (!message.content.startsWith(prefix)) return;


    var commandBody = message.content.slice(prefix.length);
    var args = commandBody.split(' ');
    var command = args.shift().toUpperCase();

    if (command){
        const rp = require('request-promise');
        const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            'symbol': command
        },
        headers: {
            'X-CMC_PRO_API_KEY': ' COINMARKET CRYPTO API KEY HERE '
        },
        json: true,
        gzip: true
        };
        console.log(command);
        rp(requestOptions).then(response => {
        // console.log('API call response:', response); // For seeing info in console. Not needed unless troubleshooting
        // console.log(command + ' Price:', response['data'][command]['quote']['USD']['price']); // For seeing info in console. Not needed unless troubleshooting
        id = response['data'][command]['id'];
        unrounded = response['data'][command]['quote']['USD']['price'];
        percentChange = response['data'][command]['quote']['USD']['percent_change_1h'];

        percentChange = percentChange.toFixed(2);
        if (percentChange < 0){
          sign = "";
        }
        else{
          sign = "+";
        }

        if (unrounded < 1.0){
            decimalPlace = 5
        }
        else if (unrounded >= 1.0){
            decimalPlace = 2
        }

        const priceFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimalPlace
        })
        
        rounded = priceFormatter.format(unrounded);
        // rounded = unrounded.toLocaleString("en-US", {minimumFractionDigits: 2});
        message.channel.send({
            "embed": {
               "color": 538699,
               "timestamp": Date.now(),
               "footer": {
                 "text": "CryptoBot"
               },
               "thumbnail": {
                 "url": "https://s2.coinmarketcap.com/static/img/coins/32x32/" + id + ".png",
               },
               "fields": [
                 {
                   "name": command,
                   "value": "**" + rounded + " USD " + "(" + sign + percentChange + "%)**"
                 }
               ]
             }
           });
        }).catch((err) => {
        // console.log('API call error:', err.message); // For seeing info in console. Not needed unless troubleshooting
        message.channel.send({
            "embed": {
               "color": 538699,
               "timestamp": Date.now(),
               "footer": {
                 "text": "CryptoBot"
               },
               "thumbnail": {
                 "url": "https://www.iconexperience.com/_img/v_collection_png/256x256/shadow/error.png"
               },
               "fields": [
                 {
                   "name": "ERROR",
                   "value": "Please enter a valid Crypto Symbol"
                 }
               ]
             }
           });
        });
    }

});


