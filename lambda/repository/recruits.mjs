import * as sheetsdb from './sheetsdb.mjs'
import config from '../config/config.mjs'

const sheetName = config.sheetsConfig.recruitSheetName

function mapRowToObj(row) {
    return {
        id: row[0],
        rowNum: parseInt(row[0], 10) + 1,
        name: `${row[1].trim()}-${row[2].trim()}`,
        stage: row[3],
        discord: row[4],
        bnet: row[5],
        class: row[6],
        spec: row[7],
        role: row[8],
        content: row[9],
        comment: row[10],
        wcl: row[11],
        rio: row[12],
        referral: row[13],
        notes: row[14]
    }
}

function mapObjToRow(obj) {
    const nameSplit = obj.name.split('-')
    return [obj.id, nameSplit[0], nameSplit[1], obj.stage, obj.discord, obj.bnet, obj.class, obj.spec, obj.role.join(', '), obj.content.join(', '), obj.comment, obj.wcl, obj.rio, obj.referral, obj.notes]
}

async function list() {
    console.log('Fetching recruit data from Google Sheets')
    const rows = await sheetsdb.getSheetData(`'${sheetName}'!A2:W`)

    if (!rows || rows.length === 0) {
        console.log('No data found.')
        return []
    }

    const characters = []

    const openRecruitRows = rows

    openRecruitRows.forEach((row) => {
        characters.push(mapRowToObj(row))
    })

    console.log(`Found ${characters.length} characters in Google Sheets.`)
    return characters
}

async function getById(id) {
    console.log(`Fetching recruit details for ID ${id} from Google Sheets`)

    const rowNum = id + 1
    const rows = await sheetsdb.getSheetData(`'${sheetName}'!A${rowNum}:W${rowNum}`)
    const row = rows[0]
    if (row === undefined || row[2] === undefined || row[2] === '') {
      return null
    }

    return mapRowToObj(row)
}

async function getByNameAndServer(name) {
    console.log(`Fetching recruit details for character ${name} from Google Sheets`)

    const rows = await sheetsdb.getSheetData(`'${sheetName}'!A2:W`)

    let row
    rows.forEach((r) => {
        const recruit = mapRowToObj(r)
        if (recruit.name === name) {
          row = r
        }
    })

    return row
}

async function upsert(player) {
    const row = await getByNameAndServer(player.name)
    const data = mapObjToRow(player)
    if (row === undefined) {
        console.log(`Appending character ${player.name} to Google Sheets`)
        const count = await sheetsdb.getCount(sheetName)
        data[0] = count
        await sheetsdb.appendRows(`'${sheetName}'`, [data])
    } else {
        console.log(`Updating character ${player.name} in Google Sheets`)
        data[0] = parseInt(row[0])
        await sheetsdb.updateRows(`'${sheetName}'!${data[0] + 1}:${data[0] + 1}`, [data])
    }
}

async function upsertAll(players) {
    const appends = []
    const updates = []
    const rows = await list()

    let count = await sheetsdb.getCount(sheetName)
    for (const player of players) {
        const data = mapObjToRow(player)
        const row = rows.find((r) => { data.name === r.name })
        if (row === undefined) {
            data[0] = count
            count++
            appends.push(data)
        } else {
            data[0] = parseInt(row[0])
            updates.push(data)
        }
    }

    console.log(`Appending ${appends.length} players to Google Sheets`)
    
    updates.forEach((update) => {
        sheetsdb.updateRows(`'${sheetName}'!${update[0] + 1}:${update[0] + 1}`, [update])
    })
        
    await sheetsdb.appendRows(`'${sheetName}'`, appends)
}

export { list, getById, getByNameAndServer, upsert, upsertAll }
