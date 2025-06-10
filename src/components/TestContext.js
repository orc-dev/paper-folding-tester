import { createContext, useContext, useState, useRef } from 'react';
import { THEME } from '../constants/config';
import { StatusTracker } from '../utils/StatusTracker';


const TestContext = createContext();
export const useTestContext = () => useContext(TestContext);

export const TestContextProvider = ({ children }) => {
    // States and refs
    const [themeMode, setThemeMode] = useState(THEME.ALPHA_BLENDING);

    // Meta data
    const metaData = useRef({
        pid: 'P???',
        firstName: '?',
        lastName: '?',
        email: '?@?',
        date: new Date(), 
    });

    // Data collection
    const csvDataBuf = useRef([]);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const objHoverOn = useRef('none');
    const inTesting = useRef(new StatusTracker());
    const partQuestionRef = useRef({ partId: -1, questionId: -1 });
    const objRef = useRef({
        QF1: null, QF2: null, QF3: null, QF4: null, QF5: null,
        AO1: null, AO2: null, AO3: null, AO4: null, AO5: null,
        CONF: null,
    });
    
    return (
        <TestContext.Provider
            value={{
                themeMode, setThemeMode,
                csvDataBuf, mousePosRef, inTesting, objHoverOn, metaData,
                partQuestionRef, objRef,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};