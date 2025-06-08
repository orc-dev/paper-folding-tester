import { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestContextProvider = ({ children }) => {
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

    // parse 'rgba(...)` to a list of 4 numbers
    const parseRgbaString = (rgbaString) => {
        const match = rgbaString.match(
            /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/
        );

        if (!match) {
            throw new Error('Invalid rgba format');
        }
        return [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10),
            parseFloat(match[4]),
        ];
    }

    // Compute the same RGB color given an RGBA color
    function rgbaToBlendedRgb(r, g, b, a, bg = [255, 255, 255]) {
        const blend = (channel, bgChannel) =>
            Math.round(a * channel + (1 - a) * bgChannel);

        const rFinal = blend(r, bg[0]);
        const gFinal = blend(g, bg[1]);
        const bFinal = blend(b, bg[2]);

        return `rgb(${rFinal}, ${gFinal}, ${bFinal})`;
    }

    const baseRGBA = parseRgbaString(blendAlphaStack(1));
    const solidRGB = rgbaToBlendedRgb(...baseRGBA);
    
    const computeFill = (mode, weight=1) => {
        if (mode === THEME.BLACK_WHITE) {
            return '#fff';
        }
        if (mode === THEME.SOLID_COLOR) {
            return solidRGB;
        }
        if (mode === THEME.ALPHA_BLENDING) {
            return blendAlphaStack(weight);
        }
    };

    // States and refs
    const [testCompleted, setTestCompleted] = useState(false);
    const [themeMode, setThemeMode] = useState(THEME.ALPHA_BLENDING);
    
    
    return (
        <TestContext.Provider
            value={{
                THEME, computeFill,
                testCompleted, setTestCompleted,
                themeMode, setThemeMode,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};