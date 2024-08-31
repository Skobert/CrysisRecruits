import axios from 'axios'
import * as cheerio from 'cheerio'
import config from '../config/config.mjs'
import sampleHtml from '../test/gowhtml.mjs'

// true to use the proxy and fetch live from GOW, false to use the test HTML
const LIVE_RUN = true

const scrapeConfig = config.scrapeProxyConfig

// GOW displays roles as images only, and the role is NOT in the image filename, alt text, etc.
// So this little table will convert the image number to a role.
// Image SRC is like '/assets/images/raider-role-3.png?v=2'
const gowRoleImageNumbers = {
    '1': 'Tank',
    '2': 'Healer',
    '3': 'DPS'
}

// under the comment is an optional length section of things like content, language, update time, etc.
// this table will map friendly names to those ugly icon classes
const gowDetailsIconClasses = {
    'content': 'fa-clone',
    'language': 'fa-flag-checkered',
    'updateTime': 'fa-clock',
    'bnet': 'fa-battle-net',
    'discord': 'fa-discord'
}

// for links, we look for the alt text of the hyperlinks
const gowLinksLookup = {
    'warcraftlogs': 'Warcraft Logs',
    'raiderio': 'Raider IO',
    'wowprogress': 'WoW Progress'
}

// options for hitting the proxy. The proxy gets us around cloudflare bot blocking
function compileOptions(url) {
    const opts = {
        method: 'POST',
        url: scrapeConfig.scrapeURL,
        headers: scrapeConfig.headers,
        data: {
            url,
        }
    }

    opts.headers['X-RapidAPI-Key'] = process.env.SCRAPENINJA_API_KEY
    return opts
}

async function pullRecruits() {
    const url = 'https://guildsofwow.com/recruits/'
    const searchQuery = 'us?type=1&language=2&sort=0'

    try {
        const opts = compileOptions(url + searchQuery)
        const resp = LIVE_RUN ? await axios.request(opts) : sampleHtml.resp

        const $ = cheerio.load(resp.data.body)

        const recruits = []

        $('.guild-list').find('.guild-item').each((i, element) => {
            const recruitObj = parsePersonElement($, element)

            recruits.push(recruitObj)
        })

        return recruits
    } catch (e) {
        console.error(e)
    }
}

function parsePersonElement($, element) {
    let recruitObj = {}

    const el = $(element)

    // *** name and realm ****
    recruitObj.name = el.find('.guild-title:first button').text()
    recruitObj.realm = el.find('.realm-title').clone().children().remove().end().text().trim().split(',')[0] // web scraping sux bro

    // **** class and spec ****
    const specText = el.find('.sub-title-2').text().split(' ')
    recruitObj.level = specText[0]
    let wowclass = ""
    let spec = ""

    // web scraping really sux bro
    // text can be "75 Beast Mastery Hunter", "80 Havoc Demon Hunter", or "80 Elemental Shaman"
    // 4 word strings mean the 3rd word is ambiguous whether it's part of the class or spec
    // so we parse that shit I guess.
    switch(specText.length) {
        case 3:
            wowclass = specText[2]
            spec = specText[1]
            break
        case 4:
            if (specText[1] === 'Beast') { // BM is the only 2-word spec
                wowclass = specText[3]
                spec = specText[1] + ' ' + specText[2]
            } else { // DH or DK
                wowclass = specText[2] + ' ' + specText[3]
                spec = specText[1]
            }
            break
        default:
            spec = specText[1]
            wowclass = specText[2]
    }
    recruitObj.class = wowclass
    recruitObj.spec = spec

    // **** Faction ****
    let factionIcon = el.find('img.faction-icon').first().attr('src')
    recruitObj.faction = factionIcon.substring(factionIcon.lastIndexOf('-') + 1, factionIcon.length - 4) // something like '/assets/images/faction-icon-alliance.png'

    // **** Roles ****
    let roles = []
    el.find('img.role-icon').each((i, img) => {
        const imgSrc = $(img).attr('src')
        const imgNumber = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.')).split('-')[2]
        roles.push(gowRoleImageNumbers[imgNumber])
    })
    recruitObj.roles = roles
    
    // **** Details ****
    recruitObj.comment = el.find('.guild-description .user-selectable-text').text()
    recruitObj.content = el.find(`.guild-description .${gowDetailsIconClasses['content']}`).parent().text().trim().split(', ')
    recruitObj.updateTime = el.find(`.guild-description .${gowDetailsIconClasses['updateTime']}`).parent().text().trim()

    // **** Contact ****
    // these might actually be broken, i think they via JS after page load
    const bnetElement = el.find(`.guild-navigation .${gowDetailsIconClasses['bnet']}`)
    let bnet = ''
    if (bnetElement.length !== 0) {
        bnet = bnetElement.parent().attr('data-copy-text')
    }

    const discElement = el.find(`.guild-navigation .${gowDetailsIconClasses['discord']}`)
    let disc = ''
    if (discElement.length !== 0) {
        disc = discElement.parent().attr('data-copy-text')
    }

    recruitObj.bnet = bnet
    recruitObj.disc = disc

    // **** Links ****
    const rio = el.find(`.guild-title nhea-menu li img[alt='${gowLinksLookup.raiderio}']`)
    const wcl = el.find(`.guild-title nhea-menu li img[alt='${gowLinksLookup.warcraftlogs}']`)
    const wp = el.find(`.guild-title nhea-menu li img[alt='${gowLinksLookup.wowprogress}']`)

    recruitObj.links = {
        raiderio: rio.length === 0 ? '' : rio.parent().attr('href'),
        warcraftlogs: wcl.length === 0 ? '' : wcl.parent().attr('href'),
        wowprogress: wp.length === 0 ? '' : wp.parent().attr('href')
    }

    return recruitObj
}

export default pullRecruits
