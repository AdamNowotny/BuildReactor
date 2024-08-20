import React, { createContext } from 'react';
import { CIServiceSettings, ServiceStateItem, ViewConfig } from 'common/types';

export type Theme = React.ComponentType<ThemeProps>;

export interface ThemeProps {
    popup: boolean;
}

export const ViewConfigContext = createContext<ViewConfig>({});
export const ServiceStateContext = createContext<ServiceStateItem[]>([]);
export const SettingsContext = createContext<CIServiceSettings[]>([]);
