import * as fetchService from '../service/fetchService.mjs'
import * as filterService from '../service/filterService.mjs'
import 'dotenv/config.js'

async function filterRecruits() {
    const newRecruits = await fetchService.fetchNewRecruits()

    console.log(`found ${newRecruits.length} new recruits.`)

    const filteredRecruits = await filterService.filterRecruits(newRecruits)
    console.log(`Updated / added ${filteredRecruits.length} recruits.`)
}

export default filterRecruits
