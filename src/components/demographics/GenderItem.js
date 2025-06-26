import { useState, useRef, useEffect } from 'react';
import { Input, Radio } from 'antd';
import { useTestContext } from '../TestContext';


const genderOptions = [
    { id: 0, value: 'N', label: 'I Choose Not to Identify' },
    { id: 1, value: 'M', label: 'Male' },
    { id: 2, value: 'F', label: 'Female' },
    { id: 3, value: '?', label: 'Enter in Gender Identification' },
];


function GenderItem({ styles, updateAt }) {
    const { metaData } = useTestContext();
    const [gender, setGender] = useState(-1);
    const [genderText, setGenderText] = useState('');
    const inputRef = useRef(null);

    // Focus the Input once Radio 'Enter in Gender Identification' is selected
    useEffect(() => {
       
        if (gender === 3) {
            inputRef.current?.focus();
        }
        // check update
        const a = (gender >= 0 && gender <= 2);
        const b = gender === 3 && genderText.trim().length > 0;
        updateAt(0, a || b);

    // eslint-disable-next-line 
    }, [gender, genderText]);

    const handleOnRadio = (e) => {
        const gid = e.target.value;  // typeof gid is number
        setGender(gid);
        if (gid !== 3) {
            setGenderText('');
            metaData.current.gender = genderOptions[gid].value;
        }
        else {
            metaData.current.gender = '?';
        }
    };

    const handleOnInput = (e) => {
        const inputGender = e.target.value;
        setGenderText(inputGender);
        metaData.current.gender = `[${inputGender}]`;
    };

    const radio_s = { display: 'flex', flexDirection: 'column', gap: '8px' };
    const input_s = { width: '300px', height: '30px', marginTop: '8px', marginLeft: '23px'};

    const prompt = 'What is your gender?';
    return (
        <div style={styles.field}>
            <label style={styles.label}>{prompt}</label>
            <Radio.Group 
                onChange={e => handleOnRadio(e)} 
                value={gender}
                style={radio_s}
            >
                {genderOptions.map((opt) => (
                    <div key={opt.id}>
                        <Radio value={opt.id}>{opt.label}</Radio>
                    </div>)
                )}
            </Radio.Group>
            <Input
                ref={inputRef}
                placeholder='Enter your gender'
                value={genderText}
                onChange={e => handleOnInput(e)}
                maxLength={20}
                disabled={gender !== 3}
                style={input_s}
            />
        </div>
    );
};

export default GenderItem;
