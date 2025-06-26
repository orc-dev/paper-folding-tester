import { useState, useRef } from 'react';
import { Button, Divider } from 'antd';
import { EXAMPLE, FOLDING_STEPS, UNFOLDING_STEPS } from '../constants/questions';
import { useTestContext } from './TestContext';
import QuestionFrames from './QuestionFrames';
import AnswerOptions from './AnswerOptions';


function TestInstruction() {

    const { APP_STAGE, setStage, stageRef, partQuestionRef } = useTestContext();
    const [sid, setSid] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const secondPartRef = useRef(null);

    const onConfirm = (sid) => {
        console.log(`User selects '${'ABCDE'[sid]}'`);
        setConfirmed(true);

        // Wait for the DOM to update, then scroll
        setTimeout(() => {
            secondPartRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay ensures the content is rendered
    };

    const title = (
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '38px', 
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            width: '80vw',
        }}>
            Paper Folding Test (VZ-2)
        </div>
    );
    
    const confirmButton = (
        <div style={{
            marginTop: 30,
            marginBottom: (confirmed) ? 20 : 70,
        }}>
            <Button
                type='primary'
                style={{ 
                    width: 300, 
                    height: 50, 
                    fontSize: 20, 
                    fontWeight: (sid === null || confirmed) ? 'normal' : 'bold',
                }}
                disabled={sid === null || confirmed}
                onClick={() => onConfirm(sid)}
            >
                Confirm
            </Button>
        </div>
    );

    const onStartButton = () => {
        partQuestionRef.current.partId = 0;
        partQuestionRef.current.questionId = 0;
        stageRef.current = APP_STAGE.test;
        setStage(APP_STAGE.test);
    }

    const startTestButton = (
        <div style={{
            marginTop: 20,
            marginBottom: 60,
        }}>
            <Button
                type='primary'
                style={{ 
                    width: 300, 
                    height: 50, 
                    fontSize: 20, 
                    fontWeight: 'bold',
                }}
                onClick={() => onStartButton()}
            >
                Start the Test
            </Button>
        </div>
    );

    const section1 = (
        <div style={{ width: '80vw', textAlign: 'start', fontSize: '20px'}}>
            <p>
                In this test, you'll imagine how a piece of paper is folded 
                and then unfolded after being punched with a hole. Each 
                question presents a sequence of <b>diagrams</b> showing the 
                folding process. The <b>dashed line</b> marks the original 
                paper's boundary, the <b>solid line</b> shows the current 
                fold, and the <b>final diagram</b> indicates where the hole 
                is punched.
            </p>
            <QuestionFrames frames={EXAMPLE.questionFrames} />
            <p>
                Your task is to select the option below that correctly shows 
                where the holes will appear after the paper is <b>completely 
                unfolded</b>.<br/>
                <b>Click on</b> the answer to select it. Then, click 
                the <b>Confirm</b> button to move on.
            </p>
            <AnswerOptions 
                frames={EXAMPLE.answerOptions} 
                sid={sid} 
                setSid={setSid} 
                locked={confirmed}
            />
        </div>
    );

    const section2 = (
        <div ref={secondPartRef}>
            <Divider />
            <div 
                style={{ 
                    textAlign: 'start', 
                    marginTop: 35, 
                    fontSize: 20, 
                    width: '80vw',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
            >
                <p>
                    The correct answer to the sample problem above is <b>C</b>.
                    The figures below show how the paper 
                    is <b>folded</b> and <b>punched</b>.
                </p>
                <QuestionFrames frames={FOLDING_STEPS} padding={24} />
                <p>
                    Fully <b>unfolding</b> the punched paper reveals two 
                    holes on the left side, as shown below.
                </p>
                <QuestionFrames frames={UNFOLDING_STEPS} padding={24} />
                <div style={{
                    padding: '12px', 
                    backgroundColor: 'rgb(236, 230, 230)',
                    borderRadius: '12px',
                }}>
                    Your score on this test will be the number marked correctly minus a fraction of the number
                    marked incorrectly. Therefore, it will not be to your advantage to guess unless you are able to
                    eliminate one or more of the answer choices as wrong.
                </div>
                <p>
                    If you are ready, please click the <b>Start 
                    the Test</b> button to begin.
                </p>
            </div>
        </div>
    );

    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {title}
            {section1}
            {confirmButton}
            {confirmed && section2}
            {confirmed && startTestButton}
        </div>
    );
}

export default TestInstruction;
