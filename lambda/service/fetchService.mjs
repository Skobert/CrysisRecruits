import pullRecruits from '../integration/gow.mjs'
import * as recruitRepo from '../repository/recruits.mjs'

async function fetch() {
    const recruits = await pullRecruits()
    const sheetsRecruits = await recruitRepo.list()

    return recruits
}

export default fetch