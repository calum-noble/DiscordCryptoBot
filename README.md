# DiscordCryptoBot
A bot built for Discord that retrieves updated Crypto market information via CoinMarket API.

# Instructions

1. Create a folder dedicated to the bot (e.g; CryptoBot).
2. Put the file 'index.js' in that folder.
3. Once file is there, open it and edit the lines that require your Discord bot token and CoinMarket API key. 
4. Then navigate to the folder in your command line terminal.
5. Run the following commands;
<br />a)  npm init
<br />b)  npm install
<br />c)  npm install --save request-promise
<br />d)  npm install --save request
<br />e)  npm install -g nodemon

6. Once complete, go to the file 'package.json' and find the 'scripts' section.
7. In this section add the following (including quotation marks);
<br />a)  "start": "nodemon"

This enables us to be able to start the bot by using the command 'npm start' in the terminal (if editing the index.js file this will also restart the bot when the file is saved).

8. Start the bot by using the 'npm start' command in your command line terminal.
9. The bot should work like a charm!

# Note
The current prefix of the bot is '!'. This can be changed by changing the prefix variable. 
