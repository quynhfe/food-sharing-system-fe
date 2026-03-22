import React, { createContext, useContext } from 'react';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';

interface NavigationContextType {
    currentPath: string;
    navigate: (path: string, params?: any) => void;
    replace: (path: string, params?: any) => void;
    goBack: () => void;
    params: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useLocalSearchParams();

    const navigate = (path: string, routeParams?: any) => {
        if (routeParams) {
            router.push({ pathname: path as any, params: routeParams });
        } else {
            router.push(path as any);
        }
    };

    const replace = (path: string, routeParams?: any) => {
        if (routeParams) {
            router.replace({ pathname: path as any, params: routeParams });
        } else {
            router.replace(path as any);
        }
    };

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <NavigationContext.Provider value={{ currentPath: pathname, params, navigate, replace, goBack }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error('useNavigation must be used within NavigationProvider');
    return context;
};
