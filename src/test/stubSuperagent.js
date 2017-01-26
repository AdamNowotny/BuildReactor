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

    end(callback) {
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

    expect(url) {
        this.url = url;
        return {
            respond: (body, headers = []) => {
                this.response = { body, headers, status: 200 };
            },
            error: (ex) => {
                this.error = ex;
            }
        };
    }
}

export default StubSuperagent;
