import fs from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

import loggerConfigs from '../../config/common/log-config.json' assert { type: 'json' }

const logLocation = loggerConfigs.location

if (!fs.existsSync(logLocation)) {
  if (logLocation) {
    fs.mkdirSync(logLocation)
  }
}

loggerConfigs.location = logLocation
loggerConfigs.prefix = ''

export default loggerConfigs
