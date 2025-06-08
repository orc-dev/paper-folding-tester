import { useState, useRef } from 'react';
import { Button, Divider } from 'antd';
import { EXAMPLE, FOLDING_STEPS, UNFOLDING_STEPS } from '../constants/questions';
import QuestionFrames from './QuestionFrames';
import AnswerOptions from './AnswerOptions';
import StepFrames from './StepFrames';


function TestInstruction({ setReady }) {
    const [sid, setSid] = useState(null);
    const [clickedContinue, setClickedContinue] = useState(false);
    const secondPartRef = useRef(null);

    const onContinue = () => {
        console.log(`User selects '${'ABCDE'[sid]}'`);
        setClickedContinue(true);

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
    
    const continueButton = (
        <div style={{
            marginTop: 30,
            marginBottom: (clickedContinue) ? 20 : 70,
        }}>
            <Button
                type='primary'
                style={{ 
                    width: 300, 
                    height: 50, 
                    fontSize: 20, 
                    fontWeight: (sid === null || clickedContinue) ? 'normal' : 'bold',
                }}
                disabled={sid === null || clickedContinue}
                onClick={() => onContinue(sid)}
            >
                Continue
            </Button>
        </div>
    );

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
                onClick={() => setReady(true)}
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
            <QuestionFrames question={EXAMPLE} />
            <p>
                Your task is to select the option below that correctly shows 
                where the holes will appear after the paper is <b>completely 
                unfolded</b>.<br/>
                <b>Click on</b> the answer to select it. Then, click 
                the <b>Continue</b> button to move on.
            </p>
            <AnswerOptions 
                question={EXAMPLE} 
                sid={sid} 
                setSid={setSid} 
                locked={clickedContinue}
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
                <StepFrames frames={FOLDING_STEPS} />

                <p>
                    Fully <b>unfolding</b> the punched paper reveals two 
                    holes on the left side, as shown below.
                </p>
                <StepFrames frames={UNFOLDING_STEPS} />

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
            {continueButton}
            {clickedContinue && section2}
            {clickedContinue && startTestButton}
        </div>
    );
}

export default TestInstruction;
