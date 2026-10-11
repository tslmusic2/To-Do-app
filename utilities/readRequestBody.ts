import type { IncomingMessage } from 'node:http'

export async function readRequestBody(req: IncomingMessage): Promise<unknown> {

        let body = ''

        for await (const chunk of req) {
                body += chunk.toString()
        }

        return JSON.parse(body)

}