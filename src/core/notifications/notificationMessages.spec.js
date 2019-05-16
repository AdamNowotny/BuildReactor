import notificationMessages from 'core/notifications/notificationMessages';
import serviceController from 'core/services/serviceController';

describe('notificationMessages', () => {

    let config;

    beforeEach(() => {
        spyOn(serviceController, 'typeInfoFor').and.returnValue({
            icon: 'src/services/test/icon.png'
        });
        config = {
            enabled: true,
            buildStarted: true,
            buildBroken: true,
            buildFixed: true,
            buildSuccessful: true,
            buildStillFailing: true,
            showWhenDashboardActive: false
        };
    });

    describe('build started', () => {

        it('should create message', () => {
            const message = notificationMessages.createBuildStartedMessage({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build',
                    webUrl: 'http://example.com/'
                }
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build started (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: false
            });
        });

        it('should return null if notifications disabled', () => {
            config.buildStarted = false;
            
            const message = notificationMessages.createBuildStartedMessage({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build',
                    webUrl: 'http://example.com/'
                }
            }, config);
            

            expect(message).toBeNull();
        });

        it('should show who started the build when changes available', () => {
            const message = notificationMessages.createBuildStartedMessage({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                }
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1\nUser 2'
            }));
        });

    });

    describe('build successful', () => {

        it('should show message', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    isBroken: false,
                    webUrl: 'http://example.com/'
                }
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build successful (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: false
            });
        });

        it('should show changes if available', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1',
                        message: 'message 1'
                    }, {
                        name: 'User 2',
                        message: 'message 2'
                    }]
                }
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1: message 1\nUser 2: message 2'
            }));
        });

    });

    describe('build still failing', () => {

        it('should show message', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    isBroken: true,
                    webUrl: 'http://example.com/'
                }
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build still failing (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: false
            });

        });

        it('should show changes if available', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    isBroken: true,
                    changes: [{
                        name: 'User 1',
                        message: 'message 1'
                    }, {
                        name: 'User 2',
                        message: 'message 2'
                    }]
                }
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1: message 1\nUser 2: message 2'
            }));
        });

    });

    describe('build broken', () => {

        it('should show message when build fails', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    webUrl: 'http://example.com/'
                },
                broken: true
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build broken (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: true
            });
        });

        it('should show who broke the build when changes available', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                broken: true
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1\nUser 2'
            }));
        });

        it('should show group name when available', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    group: 'group',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                broken: true
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                id: 'service_group_build',
                text: 'group / build\n\nUser 1\nUser 2'
            }));
        });

        it('should show max 2 users who broke the build', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({
                        name: `User ${d}`,
                        message: `message ${d}`
                    }))
                },
                broken: true
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1: message 1\nUser 2: message 2\n...'
            }));
        });

    });

    describe('build fixed', () => {

        it('should show message if build fixed', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    webUrl: 'http://example.com/'
                },
                fixed: true
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build fixed (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: false
            });
        });

        it('should show who fixed the build when changes available', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                fixed: true
            }, config);

            expect(message).toEqual(jasmine.objectContaining({
                text: 'build\n\nUser 1\nUser 2'
            }));
        });

    });

    describe('unstable', () => {

        it('should show message when unstable build fails', () => {
            const message = notificationMessages.createBuildFinishedMessage({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    webUrl: 'http://example.com/',
                    tags: [{
                        name: 'Unstable'
                    }]
                },
                broken: true
            }, config);

            expect(message).toEqual({
                id: 'service_build',
                title: 'Build unstable (service)',
                url: 'http://example.com/',
                icon: 'src/services/test/icon.png',
                text: 'build',
                priority: false
            });
        });

    });

    it('should show message when password expired', () => {
        const message = notificationMessages.createPasswordExpiredMessage({
            eventName: 'passwordExpired',
            source: 'service',
            details: {
                name: 'build',
                webUrl: 'http://example.com/'
            }
        });

        expect(message).toEqual({
            id: 'service_disabled',
            title: 'service',
            url: 'settings.html',
            icon: 'src/services/test/icon.png',
            text: 'Password expired. Service has been disabled.',
            priority: true
        });
    });

});
