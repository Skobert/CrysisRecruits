import axios from 'axios'
import config from '../config/config.mjs'

async function sendBotData(recruits) {
    console.log(`Sending ${recruits.length} recruits to Discord Bot`)
    const url = process.env.BOT_URL + config.botConfig.botAPIPath
    var params = {
        method: 'POST',
        url: url,
        data: {
            recruits
        },
        muteHttpExceptions: true
    }

    try {
        const resp = await axios.request(params)
        if (resp.status === 200) {
            return resp.data
        } else {
            if (resp.data.errors !== undefined) {
                throw new Error(`Received errors from bot push: ${JSON.stringify(resp.data.errors)}`)
            }
            throw new Error(`Received response code ${resp.status} posting to bot`)
        }
    } catch (e) {
        console.error(`Error posting to bot: ${e}`)
    }
}

export { sendBotData }