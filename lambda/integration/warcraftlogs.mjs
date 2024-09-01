import axios from 'axios'
import config from '../config/config.mjs'
import constants from '../model/constants.mjs'

const wclURLBase = 'https://www.warcraftlogs.com/api/v2/client'
const wclAUTHURL = 'https://www.warcraftlogs.com/oauth/token'

function compileOptions(url) {
    const encodedAuth = Buffer.from(`${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`).toString('base64')
    const headers = {
        'Authorization': 'Basic ' + encodedAuth,
        'content-type': 'application/x-www-form-urlencoded'
    }

    const opts = {
        method: 'POST',
        headers: headers,
        url: url,
        data: {
            'grant_type': 'client_credentials',
        },
        'muteHttpExceptions': true
    }
    return opts
}

async function wclAuth() {
    const opts = compileOptions(wclAUTHURL)
    try {
        const resp = await axios.request(opts)
        if (resp.status === 200) {
            const tok = resp.data.access_token
            return tok
        } else {
            throw new Error(`Received response code ${resp.status} authenticating to warcraft logs`)
        }
    } catch (e) {
        console.error(`Error authenticating to warcraft logs: ${e}`)
    }
}

async function getWCLData(accessToken, name, server, zoneID) {
    const fixedServer = server.replace(' ', '') // wcl slams servers with spaces together

    const headers = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    }

    var params = {
        method: 'GET',
        headers: headers,
        url: wclURLBase,
        data: {
            query: `
                query {
                    characterData {
                        character (name: "${name}", serverSlug: "${fixedServer}", serverRegion: "us") {
                            zoneRankings (zoneID: ${zoneID}, difficulty: ${constants.wclDifficulties[config.wclConfig.difficultySearch]}, partition: -1)
                        }
                    }
                }
            `
        },
        muteHttpExceptions: true
    }

    try {
        const resp = await axios.request(params)
        if (resp.status === 200 && (resp.data.errors === undefined || resp.data.errors.length === 0)) {
            return resp.data
        }else {
            if (resp.data.errors !== undefined) {
                throw new Error(`Received errors from warcraft logs fetch: ${JSON.stringify(resp.data.errors)}`)
            }
            throw new Error(`Received response code ${resp.status} fetching from warcraft logs`)
        }
    } catch (e) {
        console.error(`Error fetching WCL data: ${e}`)
    }
}

export { wclAuth, getWCLData }