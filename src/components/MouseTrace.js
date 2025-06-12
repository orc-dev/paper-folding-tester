import { useEffect, useState } from 'react';
import { useTestContext } from './TestContext';


function MouseTrace() {
    const { csvDataBuf, partQuestionRef } = useTestContext();
    const [drawMode, setDrawMode] = useState(false);
    const [visiblePoints, setVisiblePoints] = useState([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'd') {
                const currentPart = partQuestionRef.current.partId + 1;
                const currentQ = partQuestionRef.current.questionId + 1;

                const filtered = csvDataBuf.current.filter(
                    ([partId, questionId]) =>
                        partId === currentPart && questionId === currentQ
                );
                setVisiblePoints(filtered);
                setDrawMode(true);
                console.log(`Draw ${filtered.length} points for P${currentPart} Q${currentQ}`);
                console.log(csvDataBuf.current);
            } 
            else if (e.key === 'c') {
                setVisiblePoints([]);
                setDrawMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
    }, []);

    if (!drawMode) return null;

    return (
        <svg
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        >
            {visiblePoints.map(([,,, step, x, y, , click], idx) => (
                <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={click ? 5 : 3}
                    fill={click ? 'blue' : 'red'}
                    opacity="0.6"
                >
                    <title>{`Step ${step}`}</title>
                </circle>
            ))}
        </svg>
    );
}

export default MouseTrace;
