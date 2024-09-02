/*
 * Holds code for lambda handler wrappers
 */
import filterRecruits from './app/app.mjs'

export const handler = async () => {
    const addedRecruits = await filterRecruits()
    const response = {
        statusCode: 200,
        body: { 
            updatedRecruitCount: addedRecruits.length,
            updatedRecruits: addedRecruits
        }
    }
    return response
}
