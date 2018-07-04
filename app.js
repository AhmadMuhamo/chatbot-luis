require('dotenv-extended').load();

let restify = require('restify');
let builder = require('botbuilder');

/**
 * Setup Restify Server
 * @argument PORT
 * set the listening port in the .env file
 */
let server = restify.createServer();
server.listen(process.env.PORT, () => console.log('%s listening to %s', server.name, server.url));

/**
 * Create connector and listen for messages
 * @argument MICROSOFT_APP_ID
 * @argument MICROSOFT_APP_PASSWORD
 * those arguments can be optained from Microsoft Azure portal
 */
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

/**
 * Bot Storage: Here we register the state storage for the bot. 
 * Default store: volatile in-memory store - Only for prototyping!
 */
let inMemoryStorage = new builder.MemoryBotStorage();

let bot = new builder.UniversalBot(connector, (session) => {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
}).set('storage', inMemoryStorage); // Register in memory storage

/**
 * @argument 'LUIS_MODEL_URL',
 * This Url can be obtained by uploading or creating a model from the LUIS portal: https://www.eu.luis.ai/
 */
let recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Help', (session) => {
    session.endDialog(`try 'show me the menu', 'what can i order?' or 'i want to eat'`);
}).triggerAction({
    matches: 'Help'
});