import { useState, useRef, useEffect } from 'react';
import { Input, Checkbox } from 'antd';
import { useTestContext } from '../TestContext';


function RaceItem({ styles, updateAt }) {
    const { metaData } = useTestContext();
    const [race, setRace] = useState([]);
    const [raceText, setRaceText] = useState('');
    const inputRef = useRef(null);

    // Focus the Input once Checkbox 'Other' is selected
    useEffect(() => {
        if (race.includes(6)) {
            inputRef.current?.focus();
        }
        // check update
        const a = race.includes(6) && raceText.trim().length > 0;
        const b = !race.includes(6) && race.length > 0;
        updateAt(1, a || b);

    // eslint-disable-next-line 
    }, [race, raceText]);

    const raceOptions = [
        {id: 0, value: 'WT', label: 'White/Non-Hispanic'},
        {id: 1, value: 'HS', label: 'Hispanic', },
        {id: 2, value: 'ME', label: 'Middle Eastern', },
        {id: 3, value: 'AS', label: 'Asian',},
        {id: 4, value: 'AA', label: 'African American', },
        {id: 5, value: 'AF', label: 'African', },
        {id: 6, value: 'OT', label: 'Other'},
    ];

    const checkbox_s = {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
    };

    const input_s = { marginLeft: '23px', width: '300px' };

    const handleCheckbox = (checked) => {
        if (!checked.includes(6)) {
            setRaceText('');
            metaData.current.raceOther = 'none';
        }
        // update race
        setRace(checked);
        metaData.current.raceSeq = Array.from(checked)
                                        .sort((a, b) => a - b)
                                        .join(';');
        
    };

    const handleInput = (e) => {
        const raceInput = e.target.value;
        setRaceText(raceInput);
        metaData.current.raceOther = raceInput.trim() || 'none';
    };

    const prompt = 'What is your self-identified race/ethnicity? (Select all that apply)';
    return (
        <div style={styles.field}>
            <label style={styles.label}>{prompt}</label>
            <Checkbox.Group
                value={race}
                onChange={checked => handleCheckbox(checked)}
                style={checkbox_s}
            >
                {raceOptions.map(opt => (
                    <Checkbox key={opt.id} value={opt.id}>{opt.label}</Checkbox>
                ))}
                <Input
                    ref={inputRef}
                    style={input_s}
                    placeholder='Enter other race/ethnicity'
                    value={raceText}
                    onChange={e => handleInput(e)}
                    disabled={!race.includes(6)}
                    maxLength={30}
                />
            </Checkbox.Group>
        </div>
    );
};

export default RaceItem;