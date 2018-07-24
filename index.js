const axios = require('axios');

/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'CICI';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================



//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'addIngredient': function() {
        const slot = this.event.request.intent.slots
        axios.get(`https://fierce-shore-44704.herokuapp.com/users/1/ingredients`)
        .then(result => {
            return result.data.allIngredients.find(ele => ele.name === slot.ingredients.value)
        })
        .then(result => {
            if(result){
                return axios.post(`https://fierce-shore-44704.herokuapp.com/users/1/ingredients`, {user_id: 1, name: slot.ingredients.value, quantity: slot.quantity.value, unit: slot.units.resolutions.resolutionsPerAuthority[0].values[0].value.name, id:result.ingredient_id} )
            }
            else{
                return axios.post(`https://fierce-shore-44704.herokuapp.com/users/1/ingredients`, {user_id: 1, name: slot.ingredients.value, quantity: slot.quantity.value, unit: slot.units.resolutions.resolutionsPerAuthority[0].values[0].value.name} )
            }
        })
        .then(result => {
            this.response.speak(`I have added ${slot.quantity.value} ${slot.units.value} of ${slot.ingredients.value} to your pantry.`)
            this.emit(':responseReady')
        })
        // axios.post(`https://fierce-shore-44704.herokuapp.com/users/2/ingredients`, {user_id: 2, name: slot.ingredients.value, quantity: slot.quantity.value, unit: slot.units.resolutions.resolutionsPerAuthority[0].values[0].value.name} )
        // .then(result => {
        //     console.log(result)
        // })
            
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};