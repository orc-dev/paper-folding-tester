import { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { useTestContext } from '../TestContext';


const options = [
    { id: 0, value: 'L', label: 'Left-handedness' },
    { id: 1, value: 'R', label: 'Right-handedness' },
    { id: 2, value: 'M', label: 'Mixed-handedness' },
];

function Handedness({ styles, updateAt}) {
    const { metaData } = useTestContext();
    const [handedness, setHandedness] = useState(-1);
   
    useEffect(() => {
        console.log(handedness);
        updateAt(5, handedness >= 0);
    }, [handedness]);

    const handleOnRadio = (e) => {
        const hid = e.target.value;  // typeof gid is number
        setHandedness(hid);
        metaData.current.handedness = options[hid].value;
    };

    const radio_s = { display: 'flex', flexDirection: 'column', gap: '8px' };
    const prompt = 'What is your dominant hand?';

    return (
        <div style={styles.field}>
            <label style={styles.label}>{prompt}</label>
            <Radio.Group 
                onChange={e => handleOnRadio(e)} 
                value={handedness}
                style={radio_s}
            >
                {options.map((opt) => (
                    <div key={opt.id}>
                        <Radio value={opt.id}>{opt.label}</Radio>
                    </div>)
                )}
            </Radio.Group>
        </div>
    );
}

export default Handedness;