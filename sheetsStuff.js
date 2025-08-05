const {sheets} = require('googleapis/sheets')

const auth = new docs.auth.GoogleAuth({
  keyFilename: 'PATH_TO_SERVICE_ACCOUNT_KEY.json',
    // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: ['https://www.googleapis.com/auth/documents']
});
const authClient = await auth.getClient();

const client = await docs.docs({
    version: 'v1',
    auth: authClient
});

const createResponse = await client.documents.create({
    requestBody: {
      title: 'Your new document!',
    },
});

console.log(createResponse.data);