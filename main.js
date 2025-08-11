require('dotenv').config();
var moment = require('moment')
const {getAllConversations} = require('./conversations/intercom')

const allConvos = getAllConversations(72)
return allConvos
// const query = generateIntercomQuery()
// console.log(query)
// const conversations = getAllPaginatedConversations(query)
// return conversations
// const testData = require('./test_data/test_query.json')
// console.log(testData)





// ---Prompt---
// Fetch prompt and response schema from db (google sheet :p)
//
// ---Conversations---
// Loop through paginated conversations

// Filter out convesation by attributes not covered by intercom
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