import * as recruitRepo from '../repository/recruits.mjs'
import { wclToSheets } from '../model/modelConvert.mjs'

async function updateRecruits(allRecruits, updateRecruits) {
    const newFilteredRecruits = []
    allRecruits.forEach((a) => {
        const lookup = updateRecruits.find((u) => u.name === a.name && u.realm === a.realm)
        if (lookup === undefined) {
            newFilteredRecruits.push(a)
        }
    })

    const formatted = await wclToSheets(updateRecruits)
    recruitRepo.upsertAll(formatted)
    recruitRepo.upsertPassed(newFilteredRecruits)
}

export { updateRecruits }