import { Cheerio } from "cheerio"

export const handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello!')
    }
    return response
}
