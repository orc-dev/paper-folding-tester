import { Row, Col } from 'antd';
import { useTestContext } from './TestContext';


function QuestionFrame({ frameData }) {
    const { themeMode, computeFill } = useTestContext();

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

    return (
        <svg
            width={sideSize * scale}
            height={sideSize * scale}
            viewBox={`0 0 ${sideSize} ${sideSize}`}
            style={{ overflow: 'visible' }}
        >
            {/* pre-path */}
            {Array.isArray(frameData?.prePath) &&
                frameData?.prePath?.map((path, index) => (
                    <path
                        key={index}
                        d={path.data}
                        fill={path.fill || computeFill(themeMode, path.fVal)}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth.poly * path.sVal}
                        strokeLinecap='round'
                        vectorEffect='non-scaling-stroke'
                        strokeLinejoin='round'
                    />
                ))
            }

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
            {frameData?.polygons?.map((poly, i) => (
                <polygon
                    key={i}
                    points={poly.pts.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill={poly.fill || computeFill(themeMode, poly.fVal)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.poly * poly.sVal}
                    strokeLinecap='round'
                    vectorEffect='non-scaling-stroke'
                    strokeLinejoin='round'
                />
            ))}

            {/* holes */}
            {frameData?.hole?.map(([x, y], index) => (
                <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={holeRadius}
                    fill='#fff'
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.circle}
                    vectorEffect='non-scaling-stroke'
                />
            ))}

            {/* post-path */}
            {frameData?.postPath?.map((path, index) => (
                <path
                    key={index}
                    d={path.data}
                    fill={path.fill || computeFill(themeMode, path.fVal)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth.poly * path.sVal}
                    strokeLinecap='round'
                    vectorEffect='non-scaling-stroke'
                    strokeLinejoin='round'
                />
            ))}
        </svg>
    );
}


function QuestionFrames({frames, padding=12}) {
    return (
        <div>
            <Row gutter={[24, 24]} justify='start'>
                {frames?.map((frameData, i) => (
                    <Col key={i}>
                        <div style={{padding: padding}}>
                            <QuestionFrame frameData={frameData} />
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default QuestionFrames;
