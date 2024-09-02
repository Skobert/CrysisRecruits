import { REST, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { processLogger, speedIndexLogger } from '../util/logger.mjs'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const start = new Date()

const clientId = process.env.DISCORD_CLIENT_ID
const token = process.env.DISCORD_TOKEN

const commands = []
// Grab all the command files from the commands directory you created earlier
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.mjs'))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment\
commandFiles.forEach((file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const command = import(`./commands/${file}`)
  commands.push(command.data.toJSON())
})

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => processLogger.info(`Successfully deleted all application (/) commands.`))
	.catch(console.error)

// and deploy your commands!
(async () => {
  try {
    processLogger.info(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      // register a command to a specific server
      // Routes.applicationGuildCommands(clientId, guildId),
      // register a command globally
      Routes.applicationCommands(clientId),
      { body: commands },
    )

    const end = new Date()

    processLogger.info(`Successfully reloaded ${data.length} application (/) commands.`)
    speedIndexLogger.info(`Successfully reloaded ${data.length} application (/) commands in ${end - start} ms.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    processLogger.error(error)
  }
})()
