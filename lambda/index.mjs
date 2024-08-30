/*
 * Holds code for lambda handler wrappers
 */

export const handler = async () => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello!')
    }
    return response
}
