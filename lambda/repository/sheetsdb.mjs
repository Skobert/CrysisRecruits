import { google } from 'googleapis'

async function authFlow() {
    try {
        const client = new google.auth.JWT(
            process.env.SHEETS_CLIENT_EMAIL,
            null,
            process.env.SHEETS_PRIVATE_KEY,
            ["https://www.googleapis.com/auth/spreadsheets"]
        )

        client.authorize((error, tokens) => {
            if (error) {
                console.error(error)
                throw error
            }
        })

        const sheets = google.sheets({ version: 'v4', auth: client })
        return sheets
    } catch (e) {
        console.error(`Error with Google Auth: ${e}`)
        throw e
    }
}

async function getSheetData(dataRange) {
    const sheets = await authFlow()

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEETID,
            range: dataRange
        })
      
        return res.data.values
    } catch (e) {
        console.error(`Error fetching google sheets data: ${e}`)
    }
}

async function getCount(sheetName) {
    const sheets = await authFlow()

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEETID,
            range: `'${sheetName}'!A:A`
        })

        return res.data.values.length
    } catch (e) {
        console.error(`Error fetching google sheets count data: ${e}`)
    }
}

async function appendRows(range, data) {
    const sheets = await authFlow()
    try {
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEETID,
            range: range,
            resource: {
                values: data
            },
            valueInputOption: 'USER_ENTERED'
        })

        return res.updates
    } catch (e) {
        console.error(`Error appending google sheets data: ${e}`)
    }
}

async function updateRows(range, data) {
    const sheets = await authFlow()
    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEETID,
            range: range,
            resource: {
                values: data
            },
            valueInputOption: 'USER_ENTERED'
        })

        return res.updatedData
    } catch (e) {
        console.error(`Error updating google sheets data: ${e}`)
    }
}

export { getSheetData, getCount, appendRows, updateRows }
