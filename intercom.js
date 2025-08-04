//  ------Simple process outline------
// 
// ---Conversations---
// Generate intercom conversation api query


const now = moment()

const hourTimeFrame = 12


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





async function getConversations(query){
    
    const method = 'POST'
    const body = query
    const urlIntercomSearch = 'https://api.intercom.io/conversations/search'
    
    try{
        const page = await callIntercom(urlIntercomSearch,method,body)
        return {status:'success',page,error:null}
    }
    catch(error){
        return {status:'failure',page:null,error}
    }

} 



async function callIntercom(url, method, body) {
    const headers = {
    Authorization: `Bearer ${process.env.INTERCOM_API_KEY}`,
    'Content-Type': 'application/json',
  }

  try {
    console.log('Calling Intercom…')
    const response = await fetchWithBackoff(
      url,
      { method, headers, body },
      defaultBackoff
    )
    return { status: 'success', response, error: null }
  } catch (error) {
    console.error('Error calling Intercom!', error)
    return { status: 'failure', response: null, error }
  }
}

module.exports = {
  callIntercom,getConversations,generateIntercomQuery
}


// Loop through paginated conversations
// Filter out convesation by attributes not covered by intercom
// 







