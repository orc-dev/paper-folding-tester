import { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestContextProvider = ({ children }) => {
    // Login auth
    // ...

    const THEME = Object.freeze({
        BLACK_WHITE: 'white',
        SOLID_COLOR: 'solid',
        ALPHA_BLENDING: 'alpha',
    });
    //
    const [testCompleted, setTestCompleted] = useState(false);
    //const [themeMode, setThemeMode] = useState(THEME.ALPHA_BLENDING);
    const [themeMode, setThemeMode] = useState(THEME.BLACK_WHITE);
    
    return (
        <TestContext.Provider
            value={{
                THEME,
                testCompleted, setTestCompleted,
                themeMode, setThemeMode,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};