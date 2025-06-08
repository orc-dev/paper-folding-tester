import { useTestContext } from './TestContext';
import { Row, Col } from 'antd';

function QuestionFrame({ frameData }) {
    const { THEME, themeMode, blendAlphaStack } = useTestContext();

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
                strokeDasharray='5 5'
                strokeWidth={strokeWidth.rect}
                strokeLinecap='round'
                vectorEffect='non-scaling-stroke'
            />

            {/* Render polygons */}
            {frameData.polygons?.map((poly, i) => (
                <polygon
                    key={i}
                    points={poly.pts.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill={ComputefillColor(poly.fVal)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.poly * poly.sVal}
                    strokeLinecap='round'
                    vectorEffect='non-scaling-stroke'  // Keep stroke width fixed during zoom/scale
                    strokeLinejoin='round'             // Soften sharp corners to avoid pointy tips
                />
            ))}

            {/* hole */}
            {frameData.hole && (
                <circle
                    cx={frameData.hole[0]}
                    cy={frameData.hole[1]}
                    r={holeRadius}
                    fill='#fff'
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.circle}
                    vectorEffect='non-scaling-stroke'
                />
            )}
        </svg>
    );
}

function QuestionFrames({question}) {
    return (
        <div>
            <Row gutter={[24, 24]} justify='start'>
                {question?.questionFrames.map((frameData, i) => (
                    <Col key={i}>
                        <div style={{padding: 12}}>
                            <QuestionFrame frameData={frameData} />
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default QuestionFrames;
