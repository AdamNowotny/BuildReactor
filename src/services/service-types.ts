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
    disabled?: boolean;
    repository?: string;
}

interface CIServiceDefinitionField {
    type: string;
    name?: string;
    help?: string;
    header?: string;
    config?: string;
}

export interface CIServiceDefinition {
    typeName: string;
    baseUrl: string;
    icon: string;
    logo: string;
    fields: CIServiceDefinitionField[];
    defaultConfig: CIServiceSettings;
}

export interface CIPipeline {
    id: string;
    name: string;
    group?: boolean | null;
    isDisabled?: boolean;
    error?: { name: string, message?: string, description?: string };
}

export interface CIBuildTag {
    name: string;
    type?: string;
    description?: string;
}

export interface CIBuildChange {
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
    error?: { name: string, message?: string, description?: string };
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
    getAll: (settings: CIServiceSettings) => Rx.Observable<CIPipeline>;
    getLatest: (settings: CIServiceSettings) => Rx.Observable<CIBuild>;
    getPipelines?: (settings: CIServiceSettings) => Promise<CIPipeline[]>;
    getBuildStates?: (settings: CIServiceSettings) => Promise<CIBuild[]>;
}
