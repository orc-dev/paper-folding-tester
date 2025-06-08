import { useTestContext } from './TestContext';
import { Row, Col } from 'antd';


function AnswerOption({ holeList=[] }) {
    const { themeMode, computeFill } = useTestContext();

    // Geometry and size
    const sideSize = 24;
    const holeRadius = 1;
    const scale = 6;
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
            stroke='#ddd'
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
                fill={computeFill(themeMode)}
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

function AnswerOptions({ frames, sid, setSid, locked=false }) {
    
    const getBoxShadow = (i) => {
        if (i !== sid) {
            return 'none';
        }
        if (locked) {
            return '0 0 0 3px hsl(249, 8.90%, 84.50%)';
        }
        return '0 0 0 3px hsl(248, 100%, 54.7%)';
    }

    return (
        <div style={{textAlign: 'center'}}>
            <Row gutter={[24, 24]} justify='start'>
                {frames?.map((holeList, i) => (
                    <Col key={i}>
                        <div
                            onClick={() => {
                                if (locked) return;
                                setSid(i);
                            }}
                            style={{
                                boxShadow: getBoxShadow(i),
                                borderRadius: 8,
                                padding: 12,
                                cursor: (locked) ? 'default' : 'pointer',
                                boxSizing: 'border-box',
                            }}
                        >
                            <AnswerOption holeList={holeList} />
                            
                            { /* Answer labels */}
                            <div style={{ 
                                marginTop: 4,
                                fontSize: 24, 
                                fontWeight: (i === sid) ? 'bold' : 'normal',
                                color: (i === sid) ? '#000' : '#ccc',
                            }}>
                                {'ABCDE'[i]}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default AnswerOptions;
