import { useState } from 'react';
import { Select } from 'antd';
import { useTestContext } from '../TestContext';


// Birth year range: 1900 - 2025
const birthYears = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { label: year.toString(), value: year };
});


function BirthYearItem({ styles, updateAt }) {
    const { metaData } = useTestContext();
    const [birthYear, setBirthYear] = useState(null);

    const handleOnChange = (value) => {
        setBirthYear(value);
        metaData.current.birthYear = value;
        updateAt(2, true);
    };

    const prompt = 'What is your year of birth?';
    return (
        <div style={styles.field}>
        <label style={styles.label}>{prompt}</label>
        <Select
            placeholder='Select your birth year'
            style={{ width: '300px' }}
            value={birthYear || undefined}
            onChange={(value) => handleOnChange(value)}
            options={birthYears}
        />
        </div>
    );
}

export default BirthYearItem;