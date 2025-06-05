import { useTestContext } from './TestContext';

function QuestionFrame({ frameData }) {
    const { THEME, themeMode } = useTestContext();

    // Geometry and style constants
    const sideSize = 24;
    const holeRadius = 1;
    const scale = 6;
    const strokeColor = '#333';
    const strokeWidth = {
        rect: 1.2,
        poly: 1.5,
        circle: 1.5,
    };

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

    const ComputefillColor = (weight) => {
        if (themeMode === THEME.BLACK_WHITE) {
            return '#fff';
        }
        if (themeMode === THEME.SOLID_COLOR) {
            return blendAlphaStack(1);
        }
        if (themeMode === THEME.ALPHA_BLENDING) {
            return blendAlphaStack(weight);
        }
    };

    return (
        <svg
            width={sideSize * scale}
            height={sideSize * scale}
            viewBox={`0 0 ${sideSize} ${sideSize}`}
            style={{ overflow: 'visible' }}
        >
            {/* Base square with dashed border */}
            <rect
                x={0}
                y={0}
                width={sideSize}
                height={sideSize}
                fill='none'
                stroke={strokeColor}
                strokeDasharray='5 4'
                strokeWidth={strokeWidth.rect}
                vectorEffect='non-scaling-stroke'
            />

            {/* Render polygons */}
            {frameData.polygons?.map((poly, i) => (
                <polygon
                    //vectorEffect="non-scaling-stroke"
                    key={i}
                    points={poly.pts.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill={ComputefillColor(poly.fVal)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.poly * poly.sVal}
                    strokeLinecap='round'
                    vectorEffect='non-scaling-stroke'
                />
            ))}

            {/* hole */}
            {frameData.hole && (
                <circle
                    cx={frameData.hole[0]}
                    cy={frameData.hole[1]}
                    r={holeRadius}
                    fill="#fff"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.circle}
                    vectorEffect='non-scaling-stroke'
                />
            )}
        </svg>
    );
}

export default QuestionFrame;
