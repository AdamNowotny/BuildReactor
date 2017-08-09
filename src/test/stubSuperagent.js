class StubSuperagent {

    get(url) {
        if (this.url !== url) {
            throw new Error(`${url} does not match expected ${this.url}`);
        }
        return this;
    }

    query(data) {
        this.data = data;
        return this;
    }

    set(headers) {
        this.headers = headers;
        return this;
    }

    accept(type) {
        this.accept = type;
        return this;
    }

    end(callback) {
        if (this.parser) {
            this.response.body = this.parser(this.response);
        }
        callback(this.error, this.response);
    }

    timeout(time) {
        this.timeout = time;
        return this;
    }

    auth(user, pass) {
        this.username = user;
        this.password = pass;
        return this;
    }

    parse(parserFn) {
        this.parser = parserFn;
        return this;
    }

    expect(url) {
        this.url = url;
        return {
            respond: (body, headers = []) => {
                this.response = { body, headers, status: 200 };
            },
            respondText: (text, headers = []) => {
                this.response = { text, headers, status: 200 };
            },
            error: (ex) => {
                this.error = ex;
            }
        };
    }
}

export default StubSuperagent;
