import { useState, useRef, useEffect } from 'react';
import { useTestContext } from './TestContext';
import { Button } from 'antd';

const qboxBGColor = 'rgb(250, 250, 250)';

const styles = {
    outerDiv: {
        maxWidth: '80vw',
        margin: 'auto',
        padding: '24px',
        paddingTop: '24px',
        paddingBottom: '35px',
        lineHeight: '1.6',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bolder',
        marginBottom: '16px',
        textAlign: 'center',
    },
    intro: {
        fontSize: '16px',
        marginBottom: '24px',
    },
    qbox: {
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: `${qboxBGColor}`,
        marginBottom: '32px',
    },
    table: {
        width: '100%', 
        borderCollapse: 'collapse'
    },
    buttonContainer: {
        textAlign: 'center',
    },
    span: {
        fontWeight: 'bold',
        color: 'rgb(183, 140, 45)',
    },
    index: {
        fontWeight: 'bold',
        color: 'rgb(0, 0, 0)'
    },
    th: {
        textAlign: 'center', 
        padding: '8px', 
        backgroundColor: 'rgb(220, 220, 220)',
        border: `5px solid ${qboxBGColor}`,
        borderRadius: '12px',  
    },
};

// eslint-disable-next-line
const introText = 'Thank you for completing the test! In this section, we\'d \
    like to ask a few short questions about the strategies you used. \
    Please select the options that best describe how you approached the problems.\
    How frequently did you use the following strategies?';


function highlight(input) {
    return <span style={styles.span}>{input}</span>
}

function idFormat(idx) {
    return <span style={styles.index}>{idx}. </span>;
}

const frequencyOptions = [
    'Not used at all',
    'Little used',
    'Somewhat used',
    'Mostly used',
    'Always used'
];

const surveyQuestions = [
    {
        id: 'mentalSimulation',
        prompt: (idx) => <div>
            {idFormat(idx)}I {highlight('mentally simulated')} folding 
            and unfolding the paper, tracking the hole's location 
            through each step until the paper was fully unfolded.
        </div>,
    },
    {
        id: 'inclusiveFiltering',
        prompt: (idx) => <div>
            {idFormat(idx)}I used {highlight('inclusive filtering')}: if 
            I was confident that a hole must appear in a certain position, 
            I eliminated any answer choices that did not show a hole there.
        </div>,
    },
    {
        id: 'exclusiveFiltering',
        prompt: (idx) => <div>
            {idFormat(idx)}I used {highlight('exclusive filtering')}: if I was 
            sure a hole could not appear in a certain position, I eliminated 
            any answer choices that showed a hole there.
        </div>,
    },
    {
        id: 'numberOfHoles',
        prompt: (idx) => <div>
            {idFormat(idx)}I used {highlight('the number of holes')} as a cue 
            for reasoning, eliminating options that had too many or too few holes.
        </div>,
    },
    {
        id: 'imaginedThickness',
        prompt: (idx) => <div>
            {idFormat(idx)}I used {highlight('the imagined thickness')} of the 
            folded paper as a cue to reason about which options were plausible.
        </div>,
    },
    {
        id: 'symPattern',
        prompt: (idx) => <div>
            {idFormat(idx)}I used {highlight('symmetrical patterns')} in 
            the folded or unfolded paper to guide my decisions.
        </div>,
    },
    {
        id: 'handMoving',
        prompt: (idx) => <div>
            {idFormat(idx)}I used my {highlight('hands or gestures')} to 
            simulate the folding and unfolding process to support my reasoning.
        </div>,
    },
];


function StrategySurvey() {
    const { APP_STAGE, setStage, stageRef, metaData } = useTestContext();
    const [responses, setResponses] = useState({});
    const [hoverId, setHoverId] = useState(-1);
    const contBtnRef = useRef(null);

    const allAnswered = () => {
        const rNum = Object.keys(responses).length;
        const qNum = Object.keys(surveyQuestions).length;
        return rNum === qNum;
    }

    // eslint-disable-next-line
    useEffect(() => {
        if (!allAnswered()) return;
        
        setTimeout(() => {
            contBtnRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [responses]);

    // Local styles
    const s_td = (idx, option) => {
        const color = responses[idx] === option ? 'rgb(213, 230, 241)' : `${qboxBGColor}`;
        return {
            position: 'relative',
            textAlign: 'center',
            padding: 0,
            backgroundColor: color,
            border: '5px solid #fafafa',
            borderRadius: '8px',
            height: '100%',
        }
    }

    const s_label = {
        display: 'block',
        width: '100%',
        height: '100%',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
    };

    const s_input = { marginRight: '6px', cursor: 'pointer' };
    const s_tbody_td = (idx) => {
        return { 
            padding: '12px', 
            verticalAlign: 'top',
            backgroundColor: idx === hoverId ? 'rgb(221, 221, 206)' : 'transparent',
        };
    }

    // Event handler
    const onInputChange = (questionIdx, value) => {
        setResponses((prev) => ({ ...prev, [questionIdx]: value }));
    };

    // Components
    const title = () => <div style={styles.title}>Strategy Reflection</div>;
    const intro = () => <div style={styles.intro}>{ introText }</div>;

    const optionsTh = frequencyOptions.map((opt) => (
        <th key={opt} style={styles.th}>{opt}</th>
    ));

    const optionsTd = (q, idx) => {
        return frequencyOptions.map((option, fid) => (
            <td key={fid} 
                style={s_td(idx, fid)}
                onMouseEnter={() => setHoverId(idx)}
                onMouseLeave={() => setHoverId(-1)}
            >
                <label style={s_label}>
                    <input
                        type='radio'
                        name={q.id}
                        value={fid}
                        checked={responses[idx] === fid}
                        onChange={() => onInputChange(idx, fid)}
                        style={s_input}
                    />
                </label>
            </td>
        ));
    };

    const questionList = () => {
        return (
            <div style={styles.qbox}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Problem-Solving Strategy</th>
                            {optionsTh}
                        </tr>
                    </thead>
                    <tbody>
                    {surveyQuestions.map((q, idx) => (
                        <tr key={q.id}>
                            <td style={s_tbody_td(idx)}>{q.prompt(idx + 1)}</td>
                            {optionsTd(q, idx)}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleOnContinue = () => {
        // Write strategy survey responses
        metaData.current.strategy = surveyQuestions.map((_, idx) => responses[idx]).join('');
        console.log(metaData.current.strategy);

        // set next stage
        stageRef.current = APP_STAGE.about;
        setStage(APP_STAGE.about);
    };

    const continueButton = () => {
        const btn_s = {
            width: 200, 
            height: 40, 
            fontSize: 16, 
            fontWeight: allAnswered() ? 'bold' : 'normal',
        };
        return (
            <div ref={contBtnRef} style={styles.buttonContainer} >
                <Button 
                    type='primary'
                    style={btn_s}
                    disabled={!allAnswered()}
                    onClick={handleOnContinue}
                >
                    Continue
                </Button>
            </div>
        );
    };

    return (
        <div style={{backgroundColor: 'rgb(240, 240, 240)'}}>
            <div style={styles.outerDiv}>
                {title()}
                {intro()}
                {questionList()}
                {continueButton()}
            </div>
        </div>
    );
}

export default StrategySurvey;
