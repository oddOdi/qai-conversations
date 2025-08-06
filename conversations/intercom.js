//  ------Simple process outline------
// 
// ---Conversations---
// Generate intercom conversation api query


const hourTimeFrame = 12

const { backOff } = require('exponential-backoff')
const moment = require('moment')
const now = moment()

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

async function getConversations(body,cursor){
    
    const method = 'POST'
    const urlIntercomSearch = 'https://api.intercom.io/conversations/search'
    
    try{
        const page = await callIntercom(urlIntercomSearch,method,body)
        return {status:'success',page,error:null}
    }
    catch(error){
        return {status:'failure',page:null,error}
    }

} 

async function getAllPaginatedConversations(query){

  const maxIterations = 10
  let allResults = []
  let cursor = ''
  let pagination = {"per_page":100,"starting_after":""}
  let body = {query,pagination}



  for(let i=0;i<maxIterations;i++){

    
  // console.log('Body',body)

    try{
    const response = await getConversations(body,cursor)

    console.log(response)
    
    const { pages,conversations } = response
    
    if(pages?.page==pages.total_pages) break;
    if(pages?.next?.starting_after == undefined) break;

    body.pagination.starting_after = pages?.next?.starting_after


    allResults.push(...conversations)

    }
    catch (error){
      console.error('Catch block in get all loop wtf')
      // something responsible
    }


  }
  return allResults
}





// === Teams ===
// Relevant to store the inboxes' names and for a future ui

async function getTeams(){
    
    const method = 'GET'
    const urlIntercomTeams = 'https://api.intercom.io/teams'
    
    try{
        const page = await callIntercom(urlIntercomTeams,method)
        return {status:'success',page,error:null}
    }
    catch(error){
        return {status:'failure',page:null,error}
    }

}

// === Admins ===
// Admins are the people supporting users through intercom

async function getAdmins(){
    
    const method = 'GET'
    const urlIntercomAdmins = 'https://api.intercom.io/admins'
    
    try{
        const page = await callIntercom(urlIntercomAdmins,method)
        return {status:'success',page,error:null}
    }
    catch(error){
        return {status:'failure',page:null,error}
    }

} 


// === Helper to call Intercom with backOff and api key ===

async function callIntercom(url, method, body) {
    const headers = {
    Authorization: `Bearer ${process.env.INTERCOM_API_KEY}`,
    'Content-Type': 'application/json',
  }

  let options = {headers,method}
  if(body!=null){
    options.body = JSON.stringify(body)
  }

  try {
    console.log('Calling Intercom…')
    const response = await fetchWithBackoff(
      url,
      options,
      defaultBackoff
    )
    return { status: 'success', response, error: null }
  } catch (error) {
    console.error('Error calling Intercom!', error)
    return { status: 'failure', response: null, error }
  }
}




module.exports = {
  callIntercom,getAllPaginatedConversations,generateIntercomQuery,getAdmins,getTeams
}
 








