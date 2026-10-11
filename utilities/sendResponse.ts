import type { ServerResponse } from 'node:http'

export function sendResponse(
        res: ServerResponse, 
        statusCode: number, 
        contentType: string, 
        data: string
): void {
        res.statusCode = statusCode,
        res.setHeader('Content-Type', contentType),
        res.end(data)
}

export function sendJson(res: ServerResponse, statusCode: number, data: object) {
       sendResponse( 
        res,
        statusCode,
        'application/json',
        JSON.stringify(data)
       )
}