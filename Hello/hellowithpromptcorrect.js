// Instantiate the botbuilder
var builder = require('botbuilder');

// Create the connector
var connector = new builder.ConsoleConnector().listen();

// Create the bot
var bot = new builder.UniversalBot(connector);

// Add in the dialog
bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function(session, result) {
        session.send('Hello, ' + result.response);
    }
]);