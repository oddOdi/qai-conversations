//  ------Simple process outline------
// 
// ---Conversations---
// Generate intercom conversation api query

import 'moment';

const now = moment()

const hourTimeFrame = 12

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateIntercomQuery(hourTimeFrame){

    const startTime = now.clone().subtract(hourTimeFrame, 'hours').unix();
    const endTime = now.unix();

    return {
    operator: 'AND',
    value: [
        {
        field: 'statistics.last_close_at',
        operator: '>',
        value: startTime
        },
        {
        field: 'statistics.last_close_at',
        operator: '<',
        value: endTime
        },
        {
        field: 'state',
        operator: '=',
        value: 'closed'
        },
        {
        field:'admin_assignee_id',
        operator: '!=',
        value: ''
        },
        {
        field:'team_assignee_id',
        operator: '!=',
        value: ''
        }
    ]
    };

}


async function fetchIntercomQueryResult(query,cursor){

    try{

    const headers = {Authorization:`Bearer ${INTERCOM_API_KEY}`}

    const method = 'POST'

    const body = query

    const urlIntercomSearch = 'https://api.intercom.io/conversations/search'


    const response = await fetch(urlIntercomSearch,{method,headers,body})
    
    } catch (error){

    }

} 



// Loop through paginated conversations
// Filter out convesation by attributes not covered by intercom
// 




// ---Prompt---
// Fetch prompt and response schema from db (google sheet :p)
// 
// ---QA---
// For each conversation
//      Fetch transcript from intercom
//      Transform response to single string
//      Post to responses open ai api endpoint
//      Parse response
//      Save evaluation in db
//
// ------Execution data storage------
//
// Run initiation (date, run uuid)
// Conversation fetch (conversations fetched)
// Prompt fetch (version)
// Run completion (duration)
// 
// 
// ---Secrets loading---
// require('dotenv').config();
// process.env.INTERCOM_API_KEY
// process.env.OPENAI_API_KEY


