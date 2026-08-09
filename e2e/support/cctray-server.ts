import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';

const xml = readFileSync(new URL('../../src/services/cctray/ccnet.xml', import.meta.url), 'utf8');

export async function startCctrayServer() {
    const server = createServer((request, response) => {
        handleRequest(request, response);
    });

    await new Promise<void>(resolve => {
        server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('CCTray mock server did not receive a port');
    }

    return {
        close: () =>
            new Promise<void>((resolve, reject) => {
                server.close(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }),
        url: `http://127.0.0.1:${address.port}/cc.xml`,
    };
}

const handleRequest = (_request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/xml',
    });
    response.end(xml);
};
