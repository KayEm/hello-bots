// Instantiate the botbuilder
var builder = require('botbuilder');

// Instantiate the restify
var restify = require('restify');

// Create the connector
var connector = new builder.ChatConnector();

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

// Setup restify server to listen
var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api.messages', connector.listen());