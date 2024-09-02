import pullRecruits from '../integration/gow.mjs'
import * as recruitRepo from '../repository/recruits.mjs'
import { wclAuth, getWCLData } from '../integration/warcraftlogs.mjs'
import constants from '../model/constants.mjs'
import config from '../config/config.mjs'

async function fetchNewRecruits() {
    console.log(`Pulling from WCL..`)
    const recruits = await pullRecruits()
    console.log(`Pulling existing from Google Sheets..`)
    const sheetsRecruits = await recruitRepo.list() //doing lookup in mem instead of line-by-line to cut chatter
    const passedRecruits = await recruitRepo.listPassed() // these are people we've already filtered out in past

    const newRecruits = []

    console.log(`Filtering out recruits who are in the Pass list or are already accounted for`)
    recruits.forEach((r) => {
        const playerFullName = r.name + '-' + r.realm
        const sheetsItem = sheetsRecruits.find((el) => el.name.toLowerCase() === playerFullName.toLowerCase())
        const passedItem = passedRecruits.find((el) => el.name.toLowerCase() === playerFullName.toLowerCase())

        if (sheetsItem === undefined && passedItem === undefined) {
            newRecruits.push(r)
        }
    })
    return newRecruits
}

async function fetchWCLData(recruits) {
    const token = await wclAuth()
    console.log(`Fetching data from WCL to add to character model`)

    const promises = []
    // fuckin OOF. But WCL wants 1 character, 1 zone at a time, so fuck it I guess
    for (const recruit of recruits) {
        promises.push(fetchWCLDataByRecruit(token, recruit))
    }
    const values = await Promise.all(promises)
    return values
}

async function fetchWCLDataByRecruit(token, recruit) {
    let i = 0;
    let done = false;
    let r = recruit
    const searchZones = getZonesByConfig().sort((a, b) => { return b - a }) // sort in reverse order. Sort always sorts as strings
    r.parses = []
    while (!done) {
        const addedObj = await fetchWCLDataByRecruitAndZone(token, r, searchZones[i])
        i++
        if (addedObj !== undefined || i === searchZones.length) {
            r.parses.push(addedObj)
            done = true
        }
    }
    return r
}

async function fetchWCLDataByRecruitAndZone(token, recruit, zoneID) {
    const val = await getWCLData(token, recruit.name, recruit.realm, zoneID)
    const data = val.data.characterData.character
    let addedObj = undefined
    if (data !== null) {
        const rankings = []
        data.zoneRankings.rankings.forEach((r) => {
            rankings.push({
                encounter: `${r.encounter.name}`,
                rank: `${r.rankPercent === null ? '-' : Math.floor(r.rankPercent).toString()}`
            })
        })
        if (data.zoneRankings.bestPerformanceAverage !== null) {
            const zone = reverseZoneLookup(zoneID)
            addedObj = {
                zone: zone,
                best: data.zoneRankings.bestPerformanceAverage,
                median: data.zoneRankings.medianPerformanceAverage,
                rankings: rankings
            }
        }
    }
    return addedObj
}

function reverseZoneLookup(zoneID) {
    for (let zone in constants.wclZones) {
        if (constants.wclZones.hasOwnProperty(zone)) {
            if (constants.wclZones[zone] === zoneID) return zone
        }
    }
}

function getZonesByConfig() {
    const zoneIDs = []
    for (let zone in constants.wclZones) {
        if (constants.wclZones.hasOwnProperty(zone)) {
            if (constants.wclZones[zone] >= config.filterConfig.mostRecentRaid) zoneIDs.push(constants.wclZones[zone])
        }
    }
    return zoneIDs
}

export { fetchNewRecruits, fetchWCLData }