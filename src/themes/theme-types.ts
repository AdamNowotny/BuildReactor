import React from 'react';
import { ServiceStateItem } from 'services/service-types';
import { ConfigStorageItem } from 'services/service-types';

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
