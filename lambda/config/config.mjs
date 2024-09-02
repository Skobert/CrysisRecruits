export default
{
    "scrapeProxyConfig": {
        "scrapeURL": "https://scrapeninja.p.rapidapi.com/scrape",
        "headers": {
          "content-type": "application/json",
          "X-RapidAPI-Host": "scrapeninja.p.rapidapi.com"
        }
    },
    "sheetsConfig": {
        "recruitSheetName": "Recruits",
        "passedSheetName": "Auto Pass"
    },
    "filterConfig": {
        "includeRoles": ["Healer", "DPS"], // Healer, Tank, DPS
        "requireContent": ["Raiding"], // refer to GOW website for possible values. Remove this item if you don't want to filter on this.
        "requireContentConjunction": "AND", // AND or OR. AND means all content types are required, OR means recruit must have any of these content types.
        "levelMin": 70, // remove this item if you don't want to check for level minimums
        "nonoWords": ["new", "HC", "hardcore", "cutting edge", "CE", "OCE", "aussie", "mythic raid"], // add whatever words here. If any of these are found, it'll eliminate them.
        "useRIOFallback": true, // true to validate RIO if no WCL data
        "minRIO": 2000, // only used if useRIOFallback is true
        "minBestParse": 45,
        "compareScoreType": "Best", // Best or Median to filter using "best" or "median" parses
        "mostRecentRaid": 31 // Take this from model/constants.mjs. Ultimately this comes from WCL website. If they've been on a break, this is how far back to look for WCL parses.
    },
    "wclConfig": {
        "difficultySearch": "Heroic", // LFR, Normal, Heroic, Mythic
    }
}
