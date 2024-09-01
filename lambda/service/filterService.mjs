import config from '../config/config.mjs'

async function applyDefaultFilter(recruitList) {
    const filteredList = []

    const levelVal = config.filterConfig.levelMin !== undefined
    const contentVal = config.filterConfig.requireContent !== undefined
    const rioVal = config.filterConfig.useRIOFallback

    recruitList.forEach((r) => {
        let valid = true

        // **** minimum level validation ****
        if (levelVal && r.level < config.filterConfig.levelMin) valid = false

        // **** content validation ****
        if (contentVal) {
            if (config.filterConfig.requireContentConjunction === "OR") {
                let valPassed = false

                // for all content they have signed up, if that content is in the OR list then keep them in the pool.
                // if none of their content is in our config list, exclude them.
                r.content.forEach((c) => {
                    if (config.filterConfig.requireContent.any((c2) => c2 === c)) valPassed = true
                })

                // don't overwrite valid to true by mistake
                valid = valPassed = false ? false : valid
            } else {
                let valPassed = true

                // for all required content, if they don't have it listed we will exclude them.
                config.filterConfig.requireContent.forEach((c2) => {
                    if (r.content.find((c) => c === c2).length === 0) valPassed = false
                })

                // don't overwrite valid to true by mistake
                valid = valPassed = false ? false : valid
            }
        }

        // **** role validation ****
        let roleVal = false
        r.roles.forEach((role) => {
            if (config.filterConfig.includeRoles.some((includeRole) => role === includeRole)) roleVal = true
        })
        // don't overwrite valid to true by mistake
        valid = roleVal = false ? false : valid

        // **** No-No Words ****
        let nonoVal = true
        config.filterConfig.nonoWords.forEach((word) => {
            if (r.comment.toLowerCase().includes(word.toLowerCase())) nonoVal = false
        })
        // don't overwrite valid to true by mistake
        valid = nonoVal = false ? false : valid

        // **** Wrap-Up ****
        if (valid) filteredList.push(r)
    })

    return filteredList
}

async function applyWCLFilter(recruits) {
    const filteredList = []

    recruits.forEach((recruit) => {
        if (recruit.parses !== undefined && recruit.parses.length !== 0 && recruit.parses[0] !== undefined) {
            const parse = recruit.parses[0]
            const parseNum = parseFloat(config.filterConfig.compareScoreType === 'Best' ? parse.best : parse.median)

            if (parseNum >= config.filterConfig.minBestParse) filteredList.push(recruit)
        }
    })

    return filteredList
}

export { applyDefaultFilter, applyWCLFilter }