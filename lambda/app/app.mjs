import * as fetchService from '../service/fetchService.mjs'
import * as filterService from '../service/filterService.mjs'
import * as updateService from '../service/updateService.mjs'
import 'dotenv/config.js'

async function filterRecruits() {
    // scrape GOW
    console.log(`Scraping WCL...`)
    const newRecruits = await fetchService.fetchNewRecruits()

    // default filtering
    console.log(`Filter round 1...`)
    const defaultFilterRecruits = await filterService.applyDefaultFilter(newRecruits)

    // WCL filtering
    const testBatch = defaultFilterRecruits.slice(4,10)
    console.log(`Enriching filtered characters with WCL parse data...`)
    const wclEnrichedRecruits = await fetchService.fetchWCLData(testBatch)

    console.log(`Filter round 2...`)
    const wclFilteredRecruits = await filterService.applyWCLFilter(wclEnrichedRecruits)
    
    console.log(`Found ${wclFilteredRecruits.length} characters to add to the list.`)
    await updateService.updateRecruits(newRecruits, wclFilteredRecruits)
}

export default filterRecruits
