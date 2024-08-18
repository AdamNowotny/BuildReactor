import React, { createContext } from 'react';
import { ConfigStorageItem } from 'services/service-types';

export type Theme = React.ComponentType<ThemeProps>;

export interface ThemeProps {
    popup: boolean;
}

export const ViewContext = createContext<ConfigStorageItem>({});
