import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { speedIndexLogger, logger } from '../../util/logger.mjs'
import PostRecruitsHandler from '../handlers/postRecruitsHandler.mjs'

const postRecruitsHandler = new PostRecruitsHandler()

function recruitRoute(client) {
    const recruitRoute = express.Router()

    recruitRoute.post('/recruitList', (req, res) => {
        let transactionId = ''
        const start = Date.now()
        if (!req.header('transactionId')) {
            transactionId = uuidv4()
            req.headers.transactionId = transactionId
        } else {
            transactionId = req.header('transactionId')
        }
        
        const data = req.body
        if (data === undefined || data.recruits === undefined) {
            res.status(400)
            logger.error(`transactionId: ${transactionId} received no recruits data.`)
            res.send()
        } else {
            res.setHeader('transactionId', transactionId)
            logger.info(`transactionId: ${transactionId}, received ${data.recruits.length} recruits.`)
            postRecruitsHandler.postRecruits(client, data.recruits)
            res.send('Done')
            
            logger.info(`transactionId: ${transactionId}, discord post complete`)
        }
        
        const end = Date.now()
        speedIndexLogger.info(`transactionId: ${transactionId} test complete in ${(end - start) / 1000} seconds`)
    })

    return recruitRoute
}

export default recruitRoute