define([
        'src/cruisecontrol/ccRequest',
        'src/ajaxRequest',
        'signals',
        'text!spec/fixtures/cruisecontrol/cruisecontrolnet.xml'
    ], function (request, AjaxRequest, signals, projectsXml) {

    describe('ccRequest', function() {

        var settings;

        beforeEach(function () {
            settings = {
                url: 'http://example.com/',
                username: 'username1',
                password: 'password1'
            };
        });
        
        it('should fail if url empty', function () {
            settings.url = '';

            expect(function () {
                request.projects(settings);
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
 
        it('should get projects from correct URL', function () {
            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
                expect(this.settings.url).toBe(settings.url);
            });

            request.projects(settings);

            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
        });

        it('should convert to Json if XML returned from Ajax call', function() {
            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
                this.responseReceived.dispatch(projectsXml);
            });

            var isProcessed = false;
            var result = request.projects(settings);
            
            result.responseReceived.addOnce(function (json) {
                isProcessed = true;
                expect(json.Project.length).toBe(9);
            });

            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
            expect(isProcessed).toBeTruthy();
        });
    });
})