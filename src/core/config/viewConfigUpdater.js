function update(config = {}) {
    config.columns = config.columns || 2;
    config.fullWidthGroups = (typeof config.fullWidthGroups === 'boolean')
        ? config.fullWidthGroups
        : true;
    config.singleGroupRows = (typeof config.singleGroupRows === 'boolean')
        ? config.singleGroupRows
        : false;
    config.showCommits = (typeof config.showCommits === 'boolean')
        ? config.showCommits
        : true;
    config.showCommitsWhenGreen = (typeof config.showCommitsWhenGreen === 'boolean')
        ? config.showCommitsWhenGreen
        : false;
    config.theme = config.theme || 'dark';
    return config ? config : {
        columns: 2,
        fullWidthGroups: true,
        singleGroupRows: false,
        theme: 'dark'
    };
}

export default {
    update
};
