require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const axios = require("axios");

const TOKEN = process.env.TOKEN;
const SERVER_URL = process.env.SERVER_URL;
// const { TOKEN, SERVER_URL, HEROKU_SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
//const WEBHOOK_URL=HEROKU_SERVER_URL+URI;
const WEBHOOK_URL = SERVER_URL + URI;

//middleware
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.post(URI, async (req, res) => {
  //console.log(req.body)
  const chatId = req.body.message?.chat.id;
  const text = req.body.message?.text;

  //send a fetch request to the dictionary api to get meaning
  // console.log(text.split(" ")[0])
  if (text != "/start") {
    try {
      const dictionaryWord = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${text.split(" ")[0]}`
      );

      if (dictionaryWord.data) {
        const definitions = dictionaryWord?.data[0].meanings[0].definitions;
        let x = 1;
        let eachDefiniition = definitions.map((meaning) => {
          return `${x++}.)  ${meaning.definition} \n \n`;
        });

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: `The definition(s) for "${
            text.split(" ")[0]
          }" is/are: \n \n ${eachDefiniition.toString()}`,
          reply_to_message_id: req.body.message.message_id,
        });
        return res.send();
      } else {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: "No definitions",
          reply_to_message_id: req.body.message.message_id,
        });
        return res.send();
      }
    } catch (err) {
      console.log(err);
      try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: `"${text.split(" ")[0]}" is not an english word.`,
          reply_to_message_id: req.body.message.message_id,
        });
        return res.send();
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `Welcome to Dictionary Bot. \nI will define every word you give to me. \nYou can contact my developer via https://joshuaizu.vercel.app`,
      });
      return res.send();
    } catch (e) {
      console.log(e);
    }
  }
});

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   console.log(`App running on ${PORT}`);
// });
(async () => {
  try {
    await init();
  } catch (e) {
    console.log(e);
  }
})();

app.get("/", (req, res) => {
  res.end("bot running");
});

module.exports = app;
