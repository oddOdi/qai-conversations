//  ------Simple process outline------
// 
// ---Conversations---
// Generate intercom conversation api query
require('dotenv').config();

const { IntercomClient } = require("intercom-client");

const moment = require('moment')
const now = moment()
const hourTimeFrame = 24


const client = new IntercomClient({ token: process.env.INTERCOM_ACCESS_TOKEN });

// Declare func that returns query object taking the hour frequency of checks into account
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

async function getAllConversations(hourTimeFrame) {
  console.log('Getting all convos..')
  const all = [];
  const query = generateIntercomQuery(hourTimeFrame);
  let pagination = { per_page: 100 };
  let hasNextPage = true

  while (hasNextPage) {
    const page = await client.conversations.search({ query, pagination });
    
    all.push(...(page.data ?? []));

    hasNextPage = page.hasNextPage()
    if(!hasNextPage){console.log('breaking');break;}

    const nextCursor = page.pages?.next?.starting_after;
    if (!nextCursor) {
      pagination = null;
    } else {
      pagination = { per_page: 100, starting_after: nextCursor };
      console.log('Getting next page')
    }
  }

  //console.log(all.length)

  return all;
}


async function getAllAdmins(){
  const response = await client.admins.list()
  return response
}

async function getAllInboxes() {
  const response = await client.teams.list()
  return response
  
}
module.exports = {getAllAdmins,getAllInboxes,getAllConversations}
