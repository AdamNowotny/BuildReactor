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

interface CIServiceDefinitionField {
    type: string;
    name?: string;
    help?: string;
    header?: string;
    config?: string;
}

interface CIServiceDefinition {
    typeName: string;
    baseUrl: string;
    icon: string;
    logo: string;
    fields: CIServiceDefinitionField[];
    defaultConfig: CIServiceSettings;
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
    id: string;
    name: string;
    group: string | null;
    isBroken?: boolean;
    isRunning?: boolean;
    isWaiting?: boolean;
    isDisabled?: boolean;
    error?: { message: string };
    webUrl?: string;
    tags?: CIBuildTag[];
    changes?: CIBuildChange[];
}

export interface CIPipelineList {
    items: CIPipeline[];
    selected: string[];
}

export interface CIService {
    getInfo: () => CIServiceDefinition;
    getAll: (settings: CIServiceSettings) => Rx.Observable<any>;
    getLatest: (settings: CIServiceSettings) => Rx.Observable<any>;
}
