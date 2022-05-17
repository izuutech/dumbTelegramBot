# Dumb  Telegram Bot

** PS: The bot is probably smarter than you. It defines every words. **

## Description
This is a telegram bot built with nodejs and express. It utilizes a dictionary api and defines words for you.
Basically, if you give it a word, it will return the definition and if you give it a sentence or group of words, it will only return the definition for the first word


## Live Preview
You can use the bot live by clicking [Use Bot](https://t.me/ji_dictionary_bot)

### Getting Started Locally

1. First create a bot with Bot Father and install ngrok on your local computer and run:

```bash
ngrok http 5000
```

2. Copy the ngrok live url.

3. Create a '.env' file and fill in details for the following variables
- TOKEN(Gotten From Bot Father)
- SERVER_URL(Your ngrok live url)



4. Then, start the server by running:

```bash
npm run start
# or
yarn start
```

5. Now chat with your locally hosted bot via telegram

