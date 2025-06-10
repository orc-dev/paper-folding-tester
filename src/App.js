import { useEffect } from 'react';
import { THEME } from './constants/config.js';
import { useTestContext } from './components/TestContext.js'
import TestRunner from './components/TestRunner.js';
import RealTimeLoopManager from './components/RealTimeLoopManager.js';

function App() {
    const { setThemeMode, csvDataBuf } = useTestContext();

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
            else if (e.key === 'p') {
                console.log(csvDataBuf.current);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    
    // eslint-disable-next-line
    }, [setThemeMode]);

    return (
        <>
            <TestRunner />
            <RealTimeLoopManager />
        </>
    );
}

export default App;