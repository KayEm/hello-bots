// Instantiate the botbuilder
var builder = require('botbuilder');

// Instantiate the restify
var restify = require('restify');

// Setup restify server to listen
var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create the connector
var connector = new builder.ChatConnector();

// Create the bot
var bot = new builder.UniversalBot(connector);

server.post('/api.messages', connector.listen());

// Add in the waterfall dialogs
bot.dialog('/', [
    function(session) {
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response;
        sessionsend('Hello %(name)s! I love %(company)s!', session.userData.profile);
    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next) {
        session.userData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What is your name?");
        } else {
            next();
        }
    },
    function(session,args, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.company) {
            builder.Prompts.text(session, 'What company do you work for?');
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({response: session.dialogData.profile });
    }
]);

