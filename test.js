const {google} = require('googleapis')


const main = async () => {
    const auth = google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const sheet = await google.sheets({version:'v4', })
};




main();