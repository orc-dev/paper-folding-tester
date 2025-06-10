import { useEffect } from 'react';
import { THEME } from './constants/config.js';
import { useTestContext } from './components/TestContext.js'
import TestRunner from './components/TestRunner.js';
import MouseEventRecorder from './components/MouseEventRecorder.js';
import MouseTrace from './components/MouseTrace.js';

function App() {
    const { setThemeMode } = useTestContext();
    const enableMouseTrace = true;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '1') {
                setThemeMode(THEME.BLACK_WHITE);
                console.log('Switched to BLACK_WHITE');
            } else if (e.key === '2') {
                setThemeMode(THEME.SOLID_COLOR);
                console.log('Switched to SOLID_COLOR');
            } else if (e.key === '3') {
                setThemeMode(THEME.ALPHA_BLENDING);
                console.log('Switched to ALPHA_BLENDING');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    
    // eslint-disable-next-line
    }, [setThemeMode]);

    return (
        <>
            <TestRunner />
            <MouseEventRecorder />
            {enableMouseTrace && <MouseTrace />}
        </>
    );
}

export default App;