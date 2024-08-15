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
    pipelines: string[];
    isDisabled?: boolean;
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
    group?: string;
    isDisabled?: boolean;
    error?: { name: string; message?: string; description?: string };
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
    group?: string;
    isBroken?: boolean;
    isRunning?: boolean;
    isWaiting?: boolean;
    isDisabled?: boolean;
    error?: { name: string; message?: string; description?: string };
    webUrl?: string;
    tags?: CIBuildTag[];
    changes?: CIBuildChange[];
}

export interface CIPipelineList {
    items: CIPipeline[];
    selected: string[];
}

export interface CIService {
    // get service definition and default config
    getDefinition: () => CIServiceDefinition;
    // get list of all available pipelines
    getPipelines: (settings: CIServiceSettings) => Promise<CIPipeline[]>;
    // get latest build status for selected pipelines
    getLatestBuilds: (settings: CIServiceSettings) => Promise<CIBuild[]>;
}

export interface ServiceStateItem {
    failedCount?: number;
    runningCount?: number;
    offlineCount?: number;
    name: string;
    items?: CIBuild[];
}

export interface ConfigStorageItem {
    columns?: number;
    fullWidthGroups?: boolean;
    singleGroupRows?: boolean;
    showCommits?: boolean;
    showCommitsWhenGreen?: boolean;
    theme?: string;
    colorBlindMode?: boolean;
    notifications?: {
        enabled: boolean;
        buildBroken: boolean;
        buildFixed: boolean;
        buildStarted: boolean;
        buildSuccessful: boolean;
        buildStillFailing: boolean;
    };
}
