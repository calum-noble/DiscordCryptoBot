const Discord = require('discord.js');
const config = require('./config.json');
const { cpuUsage } = require('process');
const client = new Discord.Client();
const prefix = "!";

const coinMarketCapKey = config.coinmarket_token;

const rp = require('request-promise');

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.discord_token);

client.ws.on('INTERACTION_CREATE', async interaction => {
  const command = interaction.data.name.toLowerCase();
  const args = interaction.data.options;

  if (command === 'crypto'){ 
      // here you could do anything. in this sample
      // i reply with an api interaction
      console.log(args[0].value);
      var symbol = args[0].value.toUpperCase();
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            'symbol': args[0].value.toUpperCase()
        },
        headers: {
            'X-CMC_PRO_API_KEY': coinMarketCapKey
        },
        json: true,
        gzip: true
      };

      rp(requestOptions).then(response => {
        var command = symbol;
        id = response['data'][symbol]['id'];
        unrounded = response['data'][symbol]['quote']['USD']['price'];
        percentChange = response['data'][symbol]['quote']['USD']['percent_change_1h'];
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
        var curDate = new Date(Date.now());
        // rounded = unrounded.toLocaleString("en-US", {minimumFractionDigits: 2});
        var discEmbed = {
          color: 538699,
          timestamp: curDate.toISOString(),
          // timestamp: Date.now(),
          thumbnail: {
              url: "https://s2.coinmarketcap.com/static/img/coins/32x32/" + id + ".png",
          },
          footer: {
            text: "CryptoBot"
          },
          fields: [
            {
              name: command,
              value: "**" + rounded + " USD " + "(" + sign + percentChange + "%)**"
            }
          ]
        };
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
              type: 4,
              data: {
                  embeds: [discEmbed]
              }
          }
        })
       
        }).catch((err) => {
          var curDate = new Date(Date.now());
          var discEmbed = {
            color: 538699,
            timestamp: curDate.toISOString(),
            // timestamp: Date.now(),
            thumbnail: {
                url: "https://www.iconexperience.com/_img/v_collection_png/256x256/shadow/error.png",
            },
            footer: {
              text: "CryptoBot"
            },
            fields: [
              {
                name: "ERROR",
                value: "Please enter a valid Crypto Symbol"
              }
            ]
          };
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    embeds: [discEmbed]
                }
            }
          })
        });

      
  }
});

client.on("message", function(message) {
    if (!message.content.startsWith(prefix)) return;

    var commandBody = message.content.slice(prefix.length);
    var args = commandBody.split(' ');
    var command = args.shift().toUpperCase();

    var symbol = command;
    console.log(symbol);
    var apiuri = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=' + symbol;
    const requestOptions = {
      method: 'GET',
      uri: apiuri,
      qs: {
          symbol: command
      },
      headers: {
          'X-CMC_PRO_API_KEY': coinMarketCapKey
      },
      json: true,
      gzip: true
    };

    

    if (command){
        
      console.log(command);
      rp(requestOptions).then(response => {
        console.log(response)
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


