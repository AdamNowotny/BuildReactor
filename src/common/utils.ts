export const joinUrl = (root: string, path: string) => {
    let fullRoot = root;
    if (path.startsWith('/')) {
        path = path.substring(1, path.length);
    }
    if (path && !root.endsWith('/')) {
        fullRoot += '/';
    }
    return fullRoot + path;
};
