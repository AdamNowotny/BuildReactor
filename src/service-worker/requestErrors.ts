function RequestError(this: any, ex, url: string) {
    this.name = 'RequestError';
    this.status = ex.status;
    this.message = ex.message ?? 'Connection failed';
    this.url = url;
}

function NotFoundError(this: any, response, url: string) {
    this.name = 'NotFoundError';
    this.status = response?.status;
    this.message = `[${response?.status}] Not found`;
    this.url = url;
}

function UnauthorisedError(this: any, response, url: string) {
    this.name = 'UnauthorisedError';
    this.status = response?.status;
    this.message = `[${response?.status}] Unauthorised`;
    this.url = url;
}

const create = (response: Response, url: string) => {
    if (response.status === 404) {
        return new NotFoundError(response, url);
    }
    if ([401, 403].includes(response.status)) {
        return new UnauthorisedError(response, url);
    }
    return new RequestError(response, response.url);
};

export default {
    create,
};
