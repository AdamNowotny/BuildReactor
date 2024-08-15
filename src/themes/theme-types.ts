import React from 'react';
import { ServiceStateItem } from 'service-worker/storage/service-state';
import { ConfigStorageItem } from 'service-worker/storage/view-config';

interface ThemeDefinition {
    name: string;
    defaultViewSettings: Record<string, any>;
}

export interface Theme {
    getDefinition(): ThemeDefinition;
    Popup: React.ComponentType<ThemeProps>;
    Dashboard: React.ComponentType<ThemeProps>;
}

export interface ThemeProps {
    serviceStates: ServiceStateItem[];
    viewConfig: ConfigStorageItem;
}
