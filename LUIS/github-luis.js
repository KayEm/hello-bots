// Instantiate the botbuilder
var builder = require('botbuilder');

// Instantiate the https
var https = require('https');

// Instantiate the querystring
var querystring = require('querystring');

// The list of prompts from JS file
var prompts = require('./LUIS/prompts');

// Get the URL for the LUIS model
var model = process.env.LUIS_MODEL;

// Create the recognizer with model
var recognizer = new builder.LuisRecognizer(model);

// Create dialog with recognizer
var dialog = new builder.IntentDialog({recognizers: [recognizer]});

// Setup dialog with LUIS intents and default dialog
module.exports = dialog
    .matches('LoadProfile', [
        confirmUsername, getProfile
    ])
    .matches('SearchProfile', [
        confirmQuery, searchProfiles, getProfile
    ]) 
    .onDefault([sendInstructions, redirectConversation]);

// Called for 'search profile'
function confirmQuery(session, args, next) {
    session.dialogData.entities = args.entities;
    var query = builder.EntityRecognizer.findEntity(args.entities, 'query');

    if (query) {
        next({response: query.entity});
    } else {
        builder.Prompts.text(session, 'Who are you searching for?');
    }
}

// Called for 'load profile'
function confirmUsername(session, results, next) {
    session.dialogData.entities = args.entities;

    var username = builder.EntityRecognizer.findEntity(args.entities, 'username');
    if (username) {
        next({response: username.entity});
    } else if (session.dialogData.username) {
        next({response: session.dialogData.username});
    } else {
        builder.Prompts.text('What is the username?');
    }
}

function getProfile(session, results, args) {
    var username = results.response;

    if (username.entity) {
        username = session.dialogData.username = username.entity;
    } else {
        session.dialogData.user = username;
    }

    if (!username) {
        session.endDialog('Request cancelled.');
    } else if (session.dialogData.profile && 
        typeof (session.dialogData.profile.login) !== 'undefined') {
            next();
        } else {
            loadProfile(username, function (profile) {
                if (profile && profile.message !== 'Not found') {
                    session.dialogData.profile = profile;

                    var message = new builder.Message(session). attachments([getProfileThumbnail(session)]);
                    session.send(message);

                    next();
                } else {
                    session.endDialog('No profile found.');
                }
            })
        }
}