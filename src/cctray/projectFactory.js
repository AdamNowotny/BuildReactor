define(['signals'], function (signals) {

    var create = function (projectInfo) {
        var name = projectInfo.name,
            status = projectInfo.status,
            buildFailed = new signals.Signal(),
            buildFixed = new signals.Signal(),
            update = function (newProjectInfo) {
                if (status === 'Success' && newProjectInfo.status !== 'Success') {
                    status = newProjectInfo.status;
                    buildFailed.dispatch(this);
                }
                if (status !== 'Success' && newProjectInfo.status === 'Success') {
                    status = newProjectInfo.status;
                    buildFixed.dispatch(this);
                }
            };
        
        return {
            name: name,
            buildFailed: buildFailed,
            buildFixed: buildFixed,
            update: update
        };
    };
    
    return {
        create: create
    };
});