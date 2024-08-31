import pullRecruits from '../integration/gow.mjs'

async function fetch() {
    const recruits = await pullRecruits()
    return recruits
}

export default fetch