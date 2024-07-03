function setItem(key, settings) {
    var settingsString = JSON.stringify(settings);
    localStorage.setItem(key, settingsString);
}

function getItem(key) {
    var settings;
    if (localStorage.getItem(key)) {
        var settingsString = localStorage.getItem(key);
        settings = JSON.parse(settingsString);
    }
    return settings;
}

export default {
    setItem: setItem,
    getItem: getItem,
};
