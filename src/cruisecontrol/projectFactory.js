define(['signals'], function(signals) {

    var create = function (initJson) {
        var name = initJson.name;
        var lastBuildStatus = initJson.lastBuildStatus;
        var buildFailed = new signals.Signal();
        var buildFixed = new signals.Signal();
        
        var update = function(updateJson) {
            if (lastBuildStatus === 'Success' && updateJson.lastBuildStatus !== 'Success') {
                lastBuildStatus = updateJson.lastBuildStatus;
                buildFailed.dispatch(this);
            };
            if (lastBuildStatus !== 'Success' && updateJson.lastBuildStatus === 'Success') {
                lastBuildStatus = updateJson.lastBuildStatus;
                buildFixed.dispatch(this);
            };
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