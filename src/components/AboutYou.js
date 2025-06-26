import { useState, useRef, useEffect } from 'react';
import { Button, Divider } from 'antd';
import { useTestContext } from './TestContext';
import GenderItem from './demographics/GenderItem';
import RaceItem from './demographics/RaceItem';
import BirthYearItem from './demographics/BirthYearItem';
import MajorItem from './demographics/MajorItem'; 
import GamesItem from './demographics/GamesItem';
import Handedness from './demographics/Handedness';


const styles = {
    outer: {
        width: `${window.innerWidth * 0.65}px`,
        margin: 'auto',
        border: '2px solid transparent',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bolder',
        marginTop: '24px',
        marginBottom: '24px',
        textAlign: 'center',
    },
    intro: {
        fontSize: '16px',
        marginBottom: '24px',
        textAlign: 'start',
    },
    board: {
        borderRadius: '12px',
        backgroundColor: 'rgb(224, 220, 212)',
        padding: '30px',
    },
    field: {
        marginBottom: '24px',
    },
    label: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '8px',
        display: 'block',
    },
    buttonContainer: {
        textAlign: 'center',
        margin: '40px',
    },
};

// Styled divider
const divider = <Divider style={{ borderColor: 'rgb(203, 199, 188)' }}/>;


function AboutYou() {
    const { APP_STAGE, setStage, metaData } = useTestContext();
    const btnRef = useRef(null);
    const [done, setDone] = useState([
        false, false, false, false, false, false
    ]);

    useEffect(() => { window.scrollTo(0, 0) }, []);

    useEffect(() => {
        // console.log(done);
    }, [done]);

    const updateAt = (i, bool) => {
        setDone(prev => {
            const updated = [...prev];
            updated[i] = bool;
            return updated;
        });
    };
   
    const handleSubmit = () => {
        console.log('submit clicked');
        console.log(metaData.current);
        setStage(APP_STAGE.upload);
    };

    const title = () => <div style={styles.title}>About You</div>;

    const submitButton = () => {
        const btn_s = {
            width: 200, 
            height: 40, 
            fontSize: 16, 
            fontWeight: done.every(Boolean) ? 'bold' : 'normal',
        };
        return (
            <div ref={btnRef} style={styles.buttonContainer} >
                <Button 
                    type='primary'
                    style={btn_s}
                    disabled={!done.every(Boolean)}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        );
    };

    
    return (
        <div style={{backgroundColor: 'rgb(240, 240, 240)'}}>
            <div style={styles.outer}>
                {title()}
                <div style={styles.board}>
                    {GenderItem({styles, updateAt})}
                    {divider}

                    {RaceItem({styles, updateAt})}
                    {divider}

                    {BirthYearItem({styles, updateAt})}
                    {divider}

                    {MajorItem({styles, updateAt})}
                    {divider}

                    {GamesItem({styles, updateAt})}
                    {divider}

                    {Handedness({styles, updateAt})}
                </div>
                {submitButton()}
            </div>
        </div>
    );
}

export default AboutYou;
