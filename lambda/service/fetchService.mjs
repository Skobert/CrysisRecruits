import pullRecruits from '../integration/gow.mjs'
import * as recruitRepo from '../repository/recruits.mjs'

async function fetchNewRecruits() {
    const recruits = await pullRecruits()
    const sheetsRecruits = await recruitRepo.list() //doing lookup in mem instead of line-by-line to cut chatter

    const newRecruits = []

    recruits.forEach((r) => {
        const playerFullName = r.name + '-' + r.realm
        const sheetsItem = sheetsRecruits.find((el) => el.name === playerFullName)

        if (sheetsItem === undefined) {
            newRecruits.push(r)
        }
    })

    return newRecruits
}

export { fetchNewRecruits }