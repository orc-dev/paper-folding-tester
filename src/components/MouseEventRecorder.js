import { useEffect, useRef } from 'react';
import { MIN_DISPLACEMENT_THR, OBJ_LIST, formatTime } from '../constants/config';
import { DisplacementChecker } from '../utils/DisplacementChecker';
import { StatusTracker } from '../utils/StatusTracker';
import { useTestContext } from './TestContext';

function MouseEventRecorder() {
    const { 
        csvDataBuf, mousePosRef, inTesting, 
        partQuestionRef, objHoverOn 
    } = useTestContext();

    const currentHover = useRef('START');

    // Contains mouse move and mouse click handlers
    useEffect(() => {
        const dispChecker = new DisplacementChecker(MIN_DISPLACEMENT_THR);

        const handleMouseMove = (e) => {
            // Get mouse pos
            const x = e.clientX;
            const y = e.clientY;
            mousePosRef.current.x = x;
            mousePosRef.current.y = y;

            // Collect data only when participant is doing the test questions
            if (inTesting.current.status !== StatusTracker.IN_PROGRESS) {
                return;
            }
            // Hover-on updates
            const hoverChanged = (currentHover.current !== objHoverOn.current);
            if (hoverChanged) {
                currentHover.current = objHoverOn.current;
            }
            const hasMovedEnough = dispChecker.exceedsThreshold(x, y);

            // Prepare data record and write into buffer
            if (hoverChanged || hasMovedEnough) {
                const record = [
                    partQuestionRef.current.partId + 1,
                    partQuestionRef.current.questionId + 1,
                    formatTime(),
                    (csvDataBuf.current.at(-1)?.[3] + 1) || 0,
                    x,
                    y,
                    currentHover.current,
                    0,
                ];
                csvDataBuf.current.push(record);
            }
        };

        const handleClick = (e) => {
            // Collect data only when participant is doing the test questions
            if (inTesting.current.status !== StatusTracker.IN_PROGRESS) {
                return;
            }
            // This handler does not write data when 'Confirm' button is clicked.
            if (currentHover.current === OBJ_LIST.CONF) {
                return;
            }
            const x = e.clientX;
            const y = e.clientY;
            const record = [
                partQuestionRef.current.partId + 1,
                partQuestionRef.current.questionId + 1,
                formatTime(),
                (csvDataBuf.current.at(-1)?.[3] + 1) || 0,
                x,
                y,
                currentHover.current,
                1,
            ];
            csvDataBuf.current.push(record);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    // eslint-disable-next-line
    }, []);

    return null;
}

export default MouseEventRecorder;
