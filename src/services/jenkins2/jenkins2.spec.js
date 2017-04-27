import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import jenkins from 'services/jenkins2/jenkins2';
import jobDetails2Fixture from 'raw!services/jenkins2/jobDetails2.fixture.json';
import jobDetailsFixture from 'raw!services/jenkins2/jobDetails.fixture.json';
import jobsFixture from 'raw!services/jenkins2/jobs.fixture.json';
import requests from 'services/jenkins2/jenkins2Requests';
import sinon from 'sinon';

describe('services/jenkins2/jenkins2', () => {

    const jobsResponse = JSON.parse(jobsFixture);
    const jobDetails = JSON.parse(jobDetailsFixture);
    const jobDetails2 = JSON.parse(jobDetails2Fixture);
    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;
    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'jobs');
        sinon.stub(requests, 'jobDetails');

        settings = {
            projects: ['org/pipeline']
        };
    });

    afterEach(() => {
        requests.jobs.restore();
        requests.jobDetails.restore();
    });

    it('returns service info', () => {
        const result = jenkins.getInfo();

        expect(result).toEqual({
            typeName: 'Jenkins 2.x',
            baseUrl: 'jenkins2',
            urlHint: 'URL, e.g. http://ci.jenkins-ci.org/',
            icon: 'core/services/jenkins/icon.png',
            logo: 'core/services/jenkins/logo.png',
            defaultConfig: {
                baseUrl: 'jenkins2',
                name: '',
                projects: [],
                url: '',
                username: '',
                password: '',
                updateInterval: 60
            }
        });
    });

    describe('getAll', () => {

        it('should pass request parameters', () => {
            requests.jobs.returns(Rx.Observable.empty());

            jenkins.getAll(settings);

            sinon.assert.calledOnce(requests.jobs);
            sinon.assert.calledWith(requests.jobs, { url: settings.url, settings });
        });

        it('should return empty sequence if no jobs', () => {
            requests.jobs.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => jenkins.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return jobs', () => {
            requests.jobs.returns(Rx.Observable.fromArray(jobsResponse.jobs));

            const result = scheduler.startScheduler(() => jenkins.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'Core/acceptance-test-harness/PR-157',
                    name: 'acceptance-test-harness / PR-157',
                    group: 'Core',
                    isDisabled: true
                }),
                onNext(200, {
                    id: 'Core/acceptance-test-harness/PR-238',
                    name: 'acceptance-test-harness / PR-238',
                    group: 'Core',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'Infrastructure/patron',
                    name: 'patron',
                    group: 'Infrastructure',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass org, pipeline and token to builds', () => {
            settings.projects = ['org/pipeline1', 'org/pipeline2'];
            requests.jobDetails.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => jenkins.getLatest(settings));

            sinon.assert.calledTwice(requests.jobDetails);
            sinon.assert.calledWith(requests.jobDetails, { id: 'org/pipeline1', settings });
            sinon.assert.calledWith(requests.jobDetails, { id: 'org/pipeline2', settings });
        });

        it('should return empty items if no builds', () => {
            requests.jobDetails.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['folder/project1/branch', 'folder/project2'];
            requests.jobDetails.returns(Rx.Observable.return(jobDetails));
            requests.jobDetails
                .withArgs({ id: 'folder/project1/branch', settings })
                .returns(Rx.Observable.return(jobDetails))
                .withArgs({ id: 'folder/project2', settings })
                .returns(Rx.Observable.return(jobDetails2));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'folder/project1/branch',
                    name: 'project1 (branch)',
                    group: 'folder',
                    webUrl: 'https://ci.jenkins.io/job/Core/job/jenkins/job/master/358/',
                    isRunning: false,
                    isDisabled: false,
                    isWaiting: false,
                    tags: [{ name: 'Canceled', type: 'warning' }],
                    changes: [
                        { name: 'user1', message: '[maven-release-plugin] prepare release jenkins-2.56' },
                        { name: 'user1', message: '[maven-release-plugin] prepare for next development iteration' }
                    ]
                }),
                onNext(200, {
                    id: 'folder/project2',
                    name: 'project2',
                    group: 'folder',
                    webUrl: 'https://ci.jenkins.io/job/Infrastructure/job/patron/14/',
                    isBroken: false,
                    isRunning: false,
                    isDisabled: false,
                    isWaiting: false,
                    tags: [],
                    changes: [
                        { name: 'user2', message: 'fixed artifact location' },
                    ]
                }),
                onCompleted(200)
            );
        });

        it('should return error if updating build fails', () => {
            settings.projects = ['folder/project1/branch', 'folder/project2'];
            requests.jobDetails.returns(Rx.Observable.return(jobDetails));
            requests.jobDetails
                .withArgs({ id: 'folder/project1/branch', settings })
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs({ id: 'folder/project2', settings })
                .returns(Rx.Observable.return(jobDetails2));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'folder/project1/branch',
                    name: 'project1 (branch)',
                    group: 'folder',
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'folder/project2',
                    name: 'project2',
                    group: 'folder',
                    webUrl: 'https://ci.jenkins.io/job/Infrastructure/job/patron/14/',
                    isBroken: false,
                    isRunning: false,
                    isDisabled: false,
                    isWaiting: false,
                    tags: [],
                    changes: [
                        { name: 'user2', message: 'fixed artifact location' },
                    ]
                }),
                onCompleted(200)
            );
        });

        it('should return failed build', () => {
            requests.jobDetails.returns(Rx.Observable.return({
                lastCompletedBuild: { result: 'FAILURE' }
            }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isBroken: true
            }));
        });

        it('should return running build', () => {
            requests.jobDetails.returns(Rx.Observable.return({
                lastBuild: { building: true }
            }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isRunning: true
            }));
        });

        it('should return waiting build', () => {
            requests.jobDetails.returns(Rx.Observable.return({ inQueue: true }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isWaiting: true
            }));
        });

        it('should parse ABORTED as tags', () => {
            requests.jobDetails.returns(Rx.Observable.return({
                lastCompletedBuild: { result: 'ABORTED' }
            }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }]
            }));
        });

        it('should parse UNSTABLE as tags', () => {
            requests.jobDetails.returns(Rx.Observable.return({
                lastCompletedBuild: { result: 'UNSTABLE' }
            }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Unstable', type: 'warning' }]
            }));
        });

        it('should parse NOT_BUILT as tags', () => {
            requests.jobDetails.returns(Rx.Observable.return({
                lastCompletedBuild: { result: 'NOT_BUILT' }
            }));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Not built', type: 'warning' }]
            }));
        });

        it('should parse changes', () => {
            requests.jobDetails.returns(Rx.Observable.return(jobDetails));

            const result = scheduler.startScheduler(() => jenkins.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                changes: [
                    { name: 'user1', message: '[maven-release-plugin] prepare release jenkins-2.56' },
                    { name: 'user1', message: '[maven-release-plugin] prepare for next development iteration' }
                ]
            }));
        });

    });
});
