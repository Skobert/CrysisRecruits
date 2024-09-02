import config from '../config/config.mjs'

function wclToSheets(recruits) {
    const formattedList = []

    recruits.forEach((recruit) => {
        let latestRaid = undefined
        let parse = undefined
        if (recruit.parses !== undefined && recruit.parses.length !== 0) {
            const parseLine = recruit.parses[0]
            latestRaid = parseLine.zone
            parse = config.filterConfig.compareScoreType === 'Best' ? parseLine.best : parseLine.median
        }

        const data = {
            id: undefined,
            rowNum: undefined,
            name: recruit.name + '-' + recruit.realm,
            stage: 'New',
            discord: recruit.disc,
            bnet: recruit.bnet,
            gow: recruit.links.guildsofwow,
            class: recruit.class,
            spec: recruit.spec,
            role: recruit.roles,
            content: recruit.content,
            comment: recruit.comment,
            wcl: recruit.links.warcraftlogs,
            latestRaid: latestRaid,
            parse: parse.toFixed(1),
            rio: recruit.links.raiderio,
            referral: 'Guilds of Wow',
            notes: undefined
        }

        formattedList.push(data)
    })

    return formattedList
}

export { wclToSheets }