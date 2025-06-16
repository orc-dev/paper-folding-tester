import { useEffect } from 'react';
import { THEME } from './constants/config.js';
import { useTestContext } from './components/TestContext.js'
import FirebaseEmailLogin from './components/FirebaseEmailLogin.js';
import TestLogin from './components/TestLogin.js';
import TestInstruction from './components/TestInstruction.js';
import TestRunner from './components/TestRunner.js';
import TestDataUploader from './components/TestDataUploader.js';
import MouseEventRecorder from './components/MouseEventRecorder.js';
import MouseTrace from './components/MouseTrace.js';

// Parameters for debug/develop mode
const enableModeSwitch = false;
const enableMouseTrace = false;

function App() {
    const { APP_STAGE, stage, setThemeMode } = useTestContext();
   
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!enableModeSwitch || stage === APP_STAGE.login) {
                return;
            }
            else if (e.key === '1') {
                setThemeMode(THEME.BLACK_WHITE);
            } 
            else if (e.key === '2') {
                setThemeMode(THEME.SOLID_COLOR);
            } 
            else if (e.key === '3') {
                setThemeMode(THEME.ALPHA_BLENDING);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
    }, [stage]);

    const currentComponent = {
        // [APP_STAGE.login]:       <TestLogin />,
        [APP_STAGE.login]:       <FirebaseEmailLogin />,
        [APP_STAGE.instruction]: <TestInstruction />,
        [APP_STAGE.test]:        <TestRunner />,
        [APP_STAGE.upload]:      <TestDataUploader />
    }

    return (
        <>
            {currentComponent[stage]}
            <MouseEventRecorder />
            {enableMouseTrace && <MouseTrace />}
        </>
    );
}

export default App;
