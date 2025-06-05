import { useEffect } from 'react';
import { useTestContext } from './components/TestContext.js'
import TestPart from './components/TestPart.js';

function App() {
    const { THEME, setThemeMode } = useTestContext();

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
  }, [THEME, setThemeMode]);

    return (
        <TestPart />
    );
}

export default App;