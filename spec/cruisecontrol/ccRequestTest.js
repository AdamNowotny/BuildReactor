define(['src/cruisecontrol/ccRequest', 'src/ajaxRequest'], function (request, AjaxRequest) {
    
    var settings = {
        url: 'http://example.com/',
        username: 'username1',
        password: 'password1'
    };

    describe('ccRequest', function() {

        it('should fail if url empty', function () {
            var settings = {
                url: ''
            };

            expect(function () {
                new BambooRequest(settings);
            }).toThrow();
        });

        it('should pass credentials to remote service', function () {
            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
                expect(this.settings.username).toBe(settings.username);
                expect(this.settings.password).toBe(settings.password);
            });

            request.projects(settings);

            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
        });
 
        it('should configure for XML response', function () {
            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
                expect(this.settings.dataType).toBe('xml');
            });

            request.projects(settings);

            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
        });
 
        it('should get projects', function () {
            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
                expect(this.settings.url).toBe(settings.url);
            });

            request.projects(settings);

            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
        });

    });
})