import { useState, useEffect } from 'react';
import { Input, Checkbox } from 'antd';
import { useTestContext } from '../TestContext';

function MajorItem({ styles, updateAt }) {
    const { metaData } = useTestContext();
    const [undecided, setUndecided] = useState(false);
    const [disabledUndecided, setDisabledUndecided] = useState(false);
    const [majors, setMajors] = useState(['', '', '']);

    // Update majors-based state
    useEffect(() => {
        const totalLength = majors.reduce((sum, e) => sum + e.trim().length, 0);
        const hasMajors = (totalLength > 0);

        setDisabledUndecided(hasMajors);
        updateAt(3, hasMajors || undecided);
    // eslint-disable-next-line
    }, [majors]);

    const prompt = 'What is your major(s)?';
    const placeholderText = [
        'Enter your primary major',
        'Enter your second major (if double major)',
        'Enter your third major (if applicable)',
    ];

    const handleUndecidedChange = (e) => {
        const checked = e.target.checked;
        setUndecided(checked);
        if (checked) {
            setMajors(['', '', '']);
            metaData.current.major = 'Undecided';
        }
        updateAt(3, checked);
    };

    const handleMajorChange = (index, value) => {
        const updatedMajors = [...majors];
        updatedMajors[index] = value;
        setMajors(updatedMajors);
        metaData.current.major = updatedMajors.join(';');
    };

    const div_s = {
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px'
    };

    const renderMajorInputs = () => {
        return majors.map((major, index) => (
            <Input
                key={index}
                value={major}
                onChange={(e) => handleMajorChange(index, e.target.value)}
                placeholder={placeholderText[index]}
                disabled={undecided}
                style={{ width: '550px', height: '30px' }}
                maxLength={60}
                allowClear
            />
        ));
    };
    
    return (
        <div style={styles.field}>
            <label style={styles.label}>{prompt}</label>
                <div style={div_s}>
                    <Checkbox
                        checked={undecided}
                        onChange={handleUndecidedChange}
                        disabled={disabledUndecided}
                        style={{ width: '120px' }}
                    >
                        Undecided
                    </Checkbox>
                    {renderMajorInputs()}
            </div>
        </div>
    );
}

export default MajorItem;