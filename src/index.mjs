import { logger, processLogger, speedIndexLogger } from './util/logger.mjs'
import {
    Client, Collection, Events, GatewayIntentBits,
} from 'discord.js'
import express from 'express'
import 'dotenv/config.js'
import config from '../config/bot/config.mjs'
import recruitRoute from './api/routes/recruitRoute.mjs'

// bot initialization
const start = new Date()
processLogger.info('Bot starting...')

const discord_token = process.env.DISCORD_TOKEN

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
    processLogger.info(`Ready! Logged in as ${c.user.tag}`)
    speedIndexLogger.info(`Bot startup completed in ${new Date() - start} ms.`)
})

// Log in to Discord with your client's token
client.login(discord_token)


// api initialization
const app = express()
const port = config.port
const appContext = config.env_app_context

// heartbeat
const healthInfoUrl = `/${appContext}/v1/health`
app.get(healthInfoUrl, (req, res) => {
    logger.debug('health ping')
    const responseData = {
        status: 'UP',
        appName: appContext
    }
    res.send(responseData)
})

app.use(express.json())

app.use(`/${appContext}/v1/recruits`, recruitRoute(client))

const PORT = config.port
app.listen(port, () => {
    if (process.env.ENVIRONMENT === 'development') {
        logger.info(`==== Executing in DEVELOPMENT mode on port ${PORT} ====`)
    } else {
        logger.info(`==== Server has started on port ${PORT} ====`)
    }
})

