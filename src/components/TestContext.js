import { createContext, useContext, useState, useRef } from 'react';
import { THEME, createFrozenMap } from '../constants/config';


const TestContext = createContext();
export const useTestContext = () => useContext(TestContext);

export const TestContextProvider = ({ children }) => {
    // States and refs
    const APP_STAGE = createFrozenMap([
        'login', 'instruction', 'test', 'upload',
    ]);
    const [stage, setStage] = useState(APP_STAGE.login);
    const stageRef = useRef(APP_STAGE.login);
    const [themeMode, setThemeMode] = useState(THEME.ALPHA_BLENDING);

    // Meta data
    const metaData = useRef({
        pid: 'P???',
        firstName: '?',
        lastName: '?',
        email: '?@?',
        startTime: `${new Date()}_before_login`,
        theme: '??',
        answer1: '',
        answer2: '',
        score1: 0,
        score2: 0,
        recordCount: 0,
    });

    // Mouse event data collection
    const csvDataBuf = useRef([]);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const objHoverOn = useRef('none');
    const partQuestionRef = useRef({ partId: -1, questionId: -1 });
    const objRef = useRef({
        QF1: null, QF2: null, QF3: null, QF4: null, QF5: null,
        AO1: null, AO2: null, AO3: null, AO4: null, AO5: null,
        CONF: null,
    });
    
    return (
        <TestContext.Provider
            value={{
                APP_STAGE, stage, setStage, stageRef, 
                themeMode, setThemeMode, metaData, objRef,
                csvDataBuf, mousePosRef, objHoverOn, partQuestionRef,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};
