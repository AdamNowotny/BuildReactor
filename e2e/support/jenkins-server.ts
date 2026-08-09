import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import jobDetails from '../../src/services/jenkins/jobDetails.json' with { type: 'json' };
import jobs from '../../src/services/jenkins/jobs.json' with { type: 'json' };

export async function startJenkinsServer({ failBuilds = false } = {}) {
    const server = createServer((request, response) => {
        handleRequest(request, response, failBuilds);
    });

    await new Promise<void>(resolve => {
        server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('Jenkins mock server did not receive a port');
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
        url: `http://127.0.0.1:${address.port}`,
    };
}

const handleRequest = (
    request: IncomingMessage,
    response: ServerResponse,
    failBuilds: boolean,
) => {
    const path = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    if (path === '/api/json') {
        sendJson(response, jobs);
        return;
    }
    if (path.startsWith('/job/') && path.endsWith('/api/json')) {
        if (failBuilds) {
            sendJson(response, { error: 'Jenkins unavailable' }, 500);
            return;
        }
        sendJson(response, jobDetails);
        return;
    }
    sendJson(response, { error: 'Not found' }, 404);
};

const sendJson = (response: ServerResponse, body: unknown, statusCode = 200) => {
    response.writeHead(statusCode, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(body));
};
