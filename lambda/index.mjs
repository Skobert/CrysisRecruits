/*
 * Holds code for lambda handler wrappers
 */
import filterRecruits from './app/app.mjs'

export const handler = async () => {
    const addedRecruits = await filterRecruits()
    const response = {
        statusCode: 200,
        body: { 
            updatedRecruitCount: addedRecruits,
            updatedRecruits: addedRecruits
        }
    }
    return response
}
