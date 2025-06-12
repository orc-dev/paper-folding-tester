import { useState } from 'react';
import { GAS_URL, ACTION } from '../constants/config.js';
import { useTestContext } from './TestContext.js';
import { Input, Button, Alert, Space } from 'antd';


function TestLogin() {
    const { APP_STAGE, setStage, metaData } = useTestContext();
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [taskCompleted, setTaskCompleted] = useState(null);
    const [validated, setValidated] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleVerifyEmail = () => {
        setErrorMsg(null);
        setSuccessMessage(null);
        setValidated(false);
    
        if (!isValidEmail(email)) {
            setErrorMsg('Invalid email format. Please enter a valid email.');
            return;
        }
        setLoading(true);
        const action = ACTION.loginVerification;
        const encodedEmail = encodeURIComponent(email);
    
        fetch(`${GAS_URL}?action=${action}&email=${encodedEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    metaData.current.pid = data.pid;
                    metaData.current.firstName = data.firstName;
                    metaData.current.lastName = data.lastName;
                    metaData.current.email = email;
                    //metaData.current.theme = data.theme;
                    
                    setTaskCompleted(data.taskCompleted);
                    setSuccessMessage(`Welcome, ${data.firstName} ${data.lastName}!`);
                    setValidated(true);
                    console.log(metaData.current);
                } else {
                    setErrorMsg('Email not found. Please enter a valid registered email.');
                }
            })
            .catch(err => {
                console.error('Error during login:', err);
                setErrorMsg('Something went wrong. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // UI components
    const inputBox = (
        <Input
            type='email'
            placeholder='Enter your registered email'
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg(null);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleVerifyEmail();
                }
            }}
            disabled={loading || validated}
            size='large'
            style={{height: '40px'}}
        />
    );

    const verifyButton = (
        <Button 
            type='primary' 
            onClick={handleVerifyEmail} 
            loading={loading} 
            disabled={!email.trim() || validated}
            block
            style={{fontWeight: 'bold', height: '40px'}}
        >
            Verify Email
        </Button>
    );

    const enterTestButton = (
        <Button 
            type='primary' 
            onClick={() => { 
                metaData.current.startTime = new Date();
                setStage(APP_STAGE.instruction);
            }} 
            style={{fontWeight: 'bold', height: '40px'}}
            block
        >
            Enter the Test
        </Button>
    );

    const warningMsg = 'You have already completed the task.';
    
    const alertError = () => (
        <Alert message={errorMsg} type='error' showIcon />
    );
    const alertWarning = () => (
        <Alert message={warningMsg} type='warning' showIcon />
    );
    const alertSuccess = () => (
        <Alert message={successMessage} type='success' showIcon />
    );

    return (
        <div style={containerStyle}><div style={boxStyle}>
            <div style={titleStyle}>Paper Folding Test</div>
            
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
                {!validated && inputBox}
                {(!validated && !errorMsg) && verifyButton}
                {(!validated && errorMsg) && alertError()}

                {validated && alertSuccess()}
                {validated && taskCompleted === false && enterTestButton}
                {validated && taskCompleted === true && alertWarning()}
            </Space>
        </div></div>
    );
}

export default TestLogin;


const containerStyle = {
    display: 'flex',
    justifyContent: 'center',  // Center hori
    alignItems: 'center',      // Center vert
    height: '100vh',           // Full viewport height
};
const boxStyle = {
    width: 400,
    textAlign: 'center',
    padding: 30,
    border: '1px solid rgb(255, 255, 255)',
    borderRadius: 8,
    backgroundColor: 'rgb(147, 200, 220)',
    boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3)',
};
const titleStyle = {
    marginTop: '20px',
    marginBottom: '50px',
    fontSize: '36px',
    fontWeight: 'bolder',
    color: 'rgb(255, 255, 255)',
};