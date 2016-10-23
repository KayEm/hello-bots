// Instantiate the botbuilder
var builder = require('botbuilder');

// Create the connector
var connector = new builder.ConsoleConnector().listen();

// Create the bot
var bot = new builder.UniversalBot(connector);

// Add in the dialog
bot.dialog('/', function(session) {
    var userMessage = session.message.text;
    session.send('You said ' + userMessage);
});