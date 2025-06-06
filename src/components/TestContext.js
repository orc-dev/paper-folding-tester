import { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestContextProvider = ({ children }) => {
    // Login auth
    // ...

    // Theme enum
    const THEME = Object.freeze({
        BLACK_WHITE: 'white',
        SOLID_COLOR: 'solid',
        ALPHA_BLENDING: 'alpha',
    });

    // Compute the final color after alpha blending
    const blendAlphaStack = (weight) => {
        // Base color for a single object (light bluish)
        const { R, G, B, A } = { R: 150, G: 150, B: 255, A: 0.4 };
       
        // Calculate final alpha after n overlapping objects
        const alpha = 1 - Math.pow(1 - A, weight);
        const blendColor = (c) => Math.round(c * alpha + 255 * (1 - alpha));
        
        return `rgba(
            ${blendColor(R)}, 
            ${blendColor(G)}, 
            ${blendColor(B)}, 
            ${alpha.toFixed(3)})`;
    };

    //
    const [testCompleted, setTestCompleted] = useState(false);
    const [themeMode, setThemeMode] = useState(THEME.ALPHA_BLENDING);
    //const [themeMode, setThemeMode] = useState(THEME.BLACK_WHITE);
    
    return (
        <TestContext.Provider
            value={{
                THEME, blendAlphaStack,
                testCompleted, setTestCompleted,
                themeMode, setThemeMode,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};