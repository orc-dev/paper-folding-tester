import { useState } from 'react';
import { Button, Row, Col, Divider } from 'antd';
import QuestionFrame from './QuestionFrame';
import AnswerOption from './AnswerOption';
import { QUESTIONS } from '../constants/questions'; 


function TestRunner() {
    const [sid, setSid] = useState(null);  // Selected answer option index
    const [pid, setPid] = useState(0);     // Part Id
    const [qid, setQid] = useState(0);     // Question Id
    const [completed, setCompleted] = useState(false);

    const handleOptionClick = (index) => {
        setSid(index);
    };

    const getAnswerLabel = (i) => 'ABCDE'[i];

    const onContinue = () => {
        console.log(`User selects '${getAnswerLabel(sid)}'`);
        // Write data for current question
        // todo...
        
        // Advance pid and qid to prepare next question
        if (qid + 1 < QUESTIONS[pid].length) {
            setQid(idx => idx + 1);
            setSid(null);
        } 
        else if (pid + 1 < QUESTIONS.length) {
            setPid(idx => idx + 1);
            setQid(0);
            setSid(null);
        } 
        else {
            // set some global variables
            setSid(null);
            setCompleted(true);
        }
    }

    if (completed) {
        return <div>All questions have been finished.</div>;
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

    const continueButton = (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        }}>
            <Button
                type='primary'
                style={{ 
                    width: 300, 
                    height: 50, 
                    fontSize: 20, 
                    fontWeight: sid === null ? 'normal' : 'bold',
                }}
                disabled={sid === null}
                onClick={() => onContinue(sid)}
            >
                Continue
            </Button>
        </div>
    );

    const questionFrames = (
        <div>
            <Row gutter={[24, 24]} justify='start'>
                {QUESTIONS[pid][qid]?.questionFrames.map((frameData, i) => (
                    <Col key={i}>
                        <div style={{padding: 12}}>
                            <QuestionFrame frameData={frameData} scale={1.5} />
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );

    const answerOptions = (
        <div>
            <Row gutter={[24, 24]} justify='start'>
                {QUESTIONS[pid][qid]?.answerOptions.map((holeList, i) => (
                    <Col key={i}>
                        <div
                            onClick={() => handleOptionClick(i)}
                            style={{
                                boxShadow: (i === sid)
                                    ? '0 0 0 3px hsl(248, 100%, 54.7%)'
                                    : 'none',
                                borderRadius: 8,
                                padding: 12,
                                cursor: 'pointer',
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
                                {getAnswerLabel(i)}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );

    return (
        <div>
            {questionLabel}
            <div 
                key={`q-${pid}-${qid}`} 
                className='fade-in' 
                style={{ textAlign: 'center', marginTop: 60 }}
            >
                <div style={{ display: 'inline-block' }}>
                    {questionFrames}
                    <Divider />
                    {answerOptions}
                </div>
            </div>
            {continueButton}
        </div>
    );
}

export default TestRunner;
