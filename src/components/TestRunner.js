import { useState } from 'react';
import { Button, Divider } from 'antd';
import { QUESTIONS } from '../constants/questions'; 
import { useTestContext } from './TestContext';
import QuestionFrames from './QuestionFrames';
import AnswerOptions from './AnswerOptions';
import { OBJ_LIST, formatTime } from '../constants/config';


function TestRunner() {
    const { 
        APP_STAGE, setStage, stageRef,
        objHoverOn, objRef, mousePosRef,
        partQuestionRef, csvDataBuf, metaData,
    } = useTestContext();

    const [pid, setPid] = useState(0);     // Part Id
    const [qid, setQid] = useState(0);     // Question Id
    const [sid, setSid] = useState(null);  // Selected answer option index
    
    const onConfirm = () => {
        // Reset objRef
        Object.keys(objRef.current).forEach((key) => {
            objRef.current[key] = null;
        });

        // Update metaData's answer and score
        const kid = QUESTIONS[pid][qid].answerKeyNum;
        metaData.current[`answer${pid + 1}`] += 'ABCDE'[sid];
        metaData.current[`score${pid + 1}`] += (sid === kid);

        // Write the last record for the current question
        if (stageRef.current === APP_STAGE.test) {
            const record = [
                partQuestionRef.current.partId + 1,
                partQuestionRef.current.questionId + 1,
                formatTime(),
                (csvDataBuf.current.at(-1)?.[3] + 1) || 0,
                mousePosRef.current.x,
                mousePosRef.current.y,
                OBJ_LIST.CONF,
                1,
            ];
            csvDataBuf.current.push(record);
        }

        // Advance pid and qid to prepare next question
        if (qid + 1 < QUESTIONS[pid].length) {
            partQuestionRef.current.questionId++;
            setQid(idx => idx + 1);
            setSid(null);
        } 
        else if (pid + 1 < QUESTIONS.length) {
            partQuestionRef.current.partId++;
            partQuestionRef.current.questionId = 0;
            setPid(idx => idx + 1);
            setQid(0);
            setSid(null);
        } 
        else {
            partQuestionRef.current.partId = -2;
            partQuestionRef.current.questionId = -2;
            stageRef.current = APP_STAGE.upload;
            setStage(APP_STAGE.upload);
            setSid(null);
        }

        // Write the first record for the next new question
        if (stageRef.current === APP_STAGE.test) {
            const record = [
                partQuestionRef.current.partId + 1,
                partQuestionRef.current.questionId + 1,
                formatTime(),
                0,
                mousePosRef.current.x,
                mousePosRef.current.y,
                OBJ_LIST.CONF,
                0,
            ];
            csvDataBuf.current.push(record);
        }
    }

    const questionLabel = (
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '38px', 
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 60,
        }}>
            Part {pid + 1} &ndash; Question {qid + 1}
        </div>
    );

    const handleMouseEnter = () => {
        if (stageRef.current !== APP_STAGE.test) {
            return;
        }
        objHoverOn.current = 'CONF';
    };

    const handleMouseLeave = () => {
        if (stageRef.current !== APP_STAGE.test) {
            return;
        }
        objHoverOn.current = 'none';
    };

    const confirmButton = (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        }}>
            <div
                onMouseEnter={() => handleMouseEnter()}
                onMouseLeave={() => handleMouseLeave()}
            >
                <Button
                    type='primary'
                    style={{ 
                        width: 300, 
                        height: 50, 
                        fontSize: 20, 
                        fontWeight: (sid === null) ? 'normal' : 'bold',
                    }}
                    disabled={sid === null}
                    onClick={() => onConfirm(sid)}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {questionLabel}
            <div 
                key={`k${pid}-${qid}`}
                className='fade-in' 
                style={{ textAlign: 'center', marginTop: 60 }}
            >
                <div style={{ display: 'inline-block' }}>
                    <QuestionFrames 
                        frames={QUESTIONS[pid][qid].questionFrames} 
                    />
                    <Divider />
                    <AnswerOptions 
                        frames={QUESTIONS[pid][qid].answerOptions} 
                        sid={sid}
                        setSid={setSid}
                    />
                </div>
            </div>
            {confirmButton}
        </div>
    );
}

export default TestRunner;
