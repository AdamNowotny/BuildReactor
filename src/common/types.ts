import Rx from 'rx';

export interface CIServiceSettings {
    baseUrl: string;
    name: string;
    token?: string;
    branch?: string;
    url?: string;
    apiUrl?: string;
    webUrl?: string;
    username?: string;
    password?: string;
    projects: string[];
    updateInterval?: number;
}

interface CIServiceInfoField {
    type: string;
    name?: string;
    help?: string;
    header?: string;
    config?: string;
}

interface CIServiceInfo {
    typeName: string;
    baseUrl: string;
    icon: string;
    logo: string;
    fields: CIServiceInfoField[];
    defaultConfig: CIServiceSettings
}

export interface CIPipeline {
    id: number;
    name: string;
    group?: boolean;
    isDisabled?: boolean;
}

interface CIBuildTag {
    name: string;
    type?: string;
    description?: string;
}

interface CIBuildChange {
    name: string;
    message?: string;
}

export interface CIBuild {
    id: string,
    name: string,
    group: string | null,
    isBroken?: boolean,
    isRunning?: boolean,
    isWaiting?: boolean,
    isDisabled?: boolean,
    error?: { message: string },
    webUrl?: string,
    tags?: CIBuildTag[],
    changes?: CIBuildChange[],
}

export interface CIService {
    getInfo(): CIServiceInfo;
    getAll(settings: CIServiceSettings): Rx.Observable<any>;
    getLatest(settings: CIServiceSettings): Rx.Observable<any>;
}
