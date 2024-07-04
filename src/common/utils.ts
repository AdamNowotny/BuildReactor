/* eslint-disable @typescript-eslint/no-magic-numbers */
export const arrayEquals = (array1: any[] = [], array2: any[] = []): boolean => {
    return array1.join('_') === array2.join('_');
}

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

export const sortBy = (propertyName, json) => {
    return json.sort((a, b) => {
        return a[propertyName] < b[propertyName] ? -1 : a[propertyName] > b[propertyName] ? 1 : 0;
    });
};
