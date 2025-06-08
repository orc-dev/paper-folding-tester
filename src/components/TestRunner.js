import { useState } from 'react';
import { Button, Divider } from 'antd';
import TestInstruction from './TestInstruction';
import QuestionFrames from './QuestionFrames';
import AnswerOptions from './AnswerOptions';
import { QUESTIONS } from '../constants/questions'; 


function TestRunner() {
    const [readInstruction, setReadInstruction] = useState(false);
    const [sid, setSid] = useState(null);  // Selected answer option index
    const [pid, setPid] = useState(0);     // Part Id
    const [qid, setQid] = useState(0);     // Question Id
    const [completed, setCompleted] = useState(false);

    if (!readInstruction) {
        return <TestInstruction setReady={setReadInstruction}/>
    }

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
                    fontWeight: (sid === null) ? 'normal' : 'bold',
                }}
                disabled={sid === null}
                onClick={() => onContinue(sid)}
            >
                Continue
            </Button>
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
                    <QuestionFrames question={QUESTIONS[pid][qid]} />
                    <Divider />
                    <AnswerOptions 
                        question={QUESTIONS[pid][qid]} 
                        sid={sid}
                        setSid={setSid}
                    />
                </div>
            </div>
            {continueButton}
        </div>
    );
}

export default TestRunner;
