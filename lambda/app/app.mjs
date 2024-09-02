import * as fetchService from '../service/fetchService.mjs'
import * as filterService from '../service/filterService.mjs'
import * as updateService from '../service/updateService.mjs'
import 'dotenv/config.js'

async function filterRecruits() {
    // scrape GOW
    console.log(`Scraping WCL...`)
    const newRecruits = await fetchService.fetchNewRecruits()

    // default filtering
    console.log(`${newRecruits.length} Found. Executing filter round 1...`)
    const defaultFilterRecruits = await filterService.applyDefaultFilter(newRecruits)

    // WCL filtering
    console.log(`Filtered to ${defaultFilterRecruits.length} recruits. Enriching filtered characters with WCL parse data...`)
    const wclEnrichedRecruits = await fetchService.fetchWCLData(defaultFilterRecruits)

    console.log(`Filtered to ${wclEnrichedRecruits.length} recruits. Executing filter round 2...`)
    const wclFilteredRecruits = await filterService.applyWCLFilter(wclEnrichedRecruits)
    
    // Push to Sheets
    console.log(`Ended at ${wclFilteredRecruits.length} characters to add to the list.`)
    await updateService.updateRecruits(newRecruits, wclFilteredRecruits)

    return wclFilteredRecruits
}

export default filterRecruits
