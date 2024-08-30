import React, { createContext } from 'react';
import {
    CIServiceDefinition,
    CIServiceSettings,
    ServiceStateItem,
    ViewConfig,
} from 'common/types';

export interface ThemeDefinition {
    name: string;
    theme?: Theme;
}

export type Theme = React.ComponentType<ThemeProps>;

export interface ThemeProps {
    popup: boolean;
}

export const ViewConfigContext = createContext<ViewConfig>({});
export const ServiceStateContext = createContext<ServiceStateItem[]>([]);
export const ServiceTypesContext = createContext<CIServiceDefinition[]>([]);
export const SettingsContext = createContext<CIServiceSettings[]>([]);
export const ServiceContext = createContext<CIServiceSettings | undefined>(undefined);
