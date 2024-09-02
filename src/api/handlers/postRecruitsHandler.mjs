import { EmbedBuilder } from "@discordjs/builders"
import { logger } from '../../util/logger.mjs'

class PostRecruitHandler {
    postRecruits(client, recruits) {
        const embeds = []
        const spacer = {
          name: '\u200b',
          value: '\u200b',
        }

        recruits.forEach((recruit) => {
            const recruitEmbed = new EmbedBuilder()
                .setColor(0x9382C9)
                .setTitle(`${recruit.name} - ${recruit.realm} (US) ${recruit.spec} ${recruit.class}`)
                .setDescription(recruit.comment)
                .setURL(recruit.links.guildsofwow)
                .setThumbnail('https://render.worldofwarcraft.com/us/guild/crest/105/emblem-105-101517-b4bba8.jpg')
                .addFields(
                    { name: "Level", value: recruit.level, inline: true },
                    { name: "Roles", value: recruit.roles.join(', '), inline: true },
                    { name: "Content", value: recruit.content.join(', '), inline: true },
                    { name: "WCL", value: recruit.links.raiderio },
                    { name: "RIO", value: recruit.links.raiderio },
                    { name: `Best Parse (${recruit.parses[0].zone})`, value: Number(recruit.parses[0].best).toFixed(1) },
                    { name: "Spreadsheet Link", value: `[Google Sheets](https://docs.google.com/spreadsheets/d/${process.env.SHEETID}/edit?gid=0#gid=0)` }
                )
            embeds.push(recruitEmbed)
        })
    
        logger.debug('Posting recruits in Discord')
        client.channels.fetch(process.env.DISCORD_POST_CHANNEL_ID).then(channel => channel.send({ embeds: embeds }))
    }
}

export default PostRecruitHandler