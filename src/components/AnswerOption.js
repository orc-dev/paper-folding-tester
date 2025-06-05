import { useTestContext } from './TestContext';

/**
 * Renders an SVG element representing an answer option for the paper folding 
 * task.The base is a square with simulated 'holes' - white circles that match 
 * the background color. A debug flag toggles the visibility of a 24×24 grid 
 * to help verify hole placement.
 */
function AnswerOption({ holeList=[] }) {
    const { THEME, themeMode } = useTestContext();

    // Geometry and size
    const sideSize = 24;
    const holeRadius = 1;
    const scale = 6;
    
    // Color and style
    const paperColor = (themeMode === THEME.BLACK_WHITE) 
        ? '#fff' : 'rgba(213, 213, 255, 0.4)';
    
    const holeColor = '#fff';
    const strokeColor = '#333';
    const strokeWidth = {
        rect: 1.5,
        circle: 1.5,
        line: 0.5,
    };

    // Debug flag and grid
    const debug = false;
    const svgLine = (key, x1, y1, x2, y2) => (
        <line 
            key={key}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ddd"
            strokeWidth={strokeWidth.line}
            vectorEffect='non-scaling-stroke'
    />);
    const debugGrid = (<>
        {[...Array(sideSize - 1)].map((_, i) => {
            const t = (i + 1);
            return (<>
                {svgLine(`v${i}`, t, 0, t, sideSize)}
                {svgLine(`h${i}`, 0, t, sideSize, t)}
            </>);
        })}
    </>);
    

    return (
        <svg
            className='answer-option'
            width={sideSize * scale}
            height={sideSize * scale}
            viewBox={`0 0 ${sideSize} ${sideSize}`}
            style={{ overflow: 'visible' }}
        >
            {/* Square 'paper' */}
            <rect
                x='0'
                y='0'
                width={sideSize}
                height={sideSize}
                fill={paperColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth.rect}
                vectorEffect='non-scaling-stroke'
            />

            {/* Holes */}
            {holeList.map(([x, y], index) => (
                <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={holeRadius}
                    fill={holeColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.circle}
                    vectorEffect='non-scaling-stroke'
                />
            ))}

            {/* Debug Grid Lines */}
            {debug && debugGrid}
        </svg>
    );
}

export default AnswerOption;
