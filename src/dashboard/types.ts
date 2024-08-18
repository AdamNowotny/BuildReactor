import React, { createContext } from 'react';
import { ServiceStateItem, ViewConfig } from 'common/types';

export type Theme = React.ComponentType<ThemeProps>;

export interface ThemeProps {
    popup: boolean;
}

export const ViewConfigContext = createContext<ViewConfig>({});
export const ServiceStateContext = createContext<ServiceStateItem[]>([]);
