import React, { createContext } from 'react';
import { ConfigStorageItem } from 'services/service-types';

interface ThemeDefinition {
    name: string;
    defaultViewSettings: Record<string, any>;
}

export interface Theme {
    getDefinition(): ThemeDefinition;
    Dashboard: React.ComponentType<ThemeProps>;
}

interface ThemeProps {
    popup: boolean;
}

export const ViewContext = createContext<ConfigStorageItem>({});
