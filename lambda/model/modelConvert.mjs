function wclToSheets(recruits) {
    const formattedList = []

    recruits.forEach((recruit) => {
        const data = {
            id: undefined,
            rowNum: undefined,
            name: recruit.name + '-' + recruit.realm,
            stage: 'New',
            discord: recruit.disc,
            bnet: recruit.bnet,
            class: recruit.class,
            spec: recruit.spec,
            role: recruit.roles,
            content: recruit.content,
            comment: recruit.comment,
            wcl: recruit.links.warcraftlogs,
            rio: recruit.links.raiderio,
            referral: 'Guilds of Wow',
            notes: undefined
        }

        formattedList.push(data)
    })

    return formattedList
}

// TODO
function sheetsToWcl(recruits) {
    const formattedList = []

    recruits.forEach((recruit) => {
        const data = {}
        formattedList.push(data)
    })

    return formattedList
}

export { wclToSheets, sheetsToWcl }