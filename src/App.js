import { useEffect } from 'react';
import { THEME } from './constants/config.js';
import { useTestContext } from './components/TestContext.js'
import TestLogin from './components/TestLogin.js';
import TestInstruction from './components/TestInstruction.js';
import TestRunner from './components/TestRunner.js';
import TestDataUploader from './components/TestDataUploader.js';
import MouseEventRecorder from './components/MouseEventRecorder.js';
import MouseTrace from './components/MouseTrace.js';


function App() {
    const { APP_STAGE, stage, setThemeMode } = useTestContext();
    const enableModeSwitch = true;
    const enableMouseTrace = true;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!enableModeSwitch) {
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
    }, []);

    const currentComponent = {
        [APP_STAGE.login]:       <TestLogin />,
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