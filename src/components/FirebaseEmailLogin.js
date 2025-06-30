import { useEffect, useState, useRef } from 'react';
import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../constants/firebaseConfig';
import { useTestContext } from './TestContext';
import { Input, Button, Alert, Space } from 'antd';


const FIREBASE_EMAIL = 'noreply@kslab-pft-2025.firebaseapp.com';
const PROJECT_LINK = 'Sign in to kslab-pft-2025';
const KS_EMAIL = 'schencklab201@gmail.com';

const MSG = {
    nameError: 'Please enter both your first and last name.',
    emailFormatError: 'Invalid email format. Please enter a valid email.',
    databaseAccessError: 'Database access error.',
    sentLinkFailError: 'Error: sent link fails.',
    noUserDoc: 'RARE ERROR: No user doc found.',
    authFailError: 'Authentication failed. Please try again.',
    taskAlreadyComplete: 'You have already completed the task.',
    info: 'Fill out the form above to sign up.',
    sendingLinkInfo: 'Sending Link to email...',
};

function FirebaseEmailLogin() {
    const { APP_STAGE, setStage, metaData } = useTestContext();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [signInEmail, setSignInEmail] = useState('');
    const docRef = useRef(null);

    const [alertType, setAlertType] = useState('info');
    const [alertText, setAlertText] = useState(MSG.info);
    const [sendingLink, setSendingLink] = useState(false); // loading
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [validated, setValidated] = useState(false);

    const emailInputRef = useRef(null);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isSigningIn = isSignInWithEmailLink(auth, window.location.href);

    
    // Reset
    useEffect(() => { 
        setLinkSent(false);
        setValidated(false);
        setAlertType('info');
        setAlertText(MSG.info);
        
    // eslint-disable-next-line
    }, [firstName, lastName, email, signInEmail]);


    const handleSendLink = async () => {
        setAlertType('info');
        setAlertText(MSG.sendingLinkInfo);
        setValidated(false);

        if (!firstName.trim() || !lastName.trim()) {
            setAlertType('error');
            setAlertText(MSG.nameError);
            return;
        }

        if (!isValidEmail(email)) {
            setAlertType('error');
            setAlertText(MSG.emailFormatError);
            return;
        }

        // Check if user is already in
        const userDocRef = doc(db, 'participants', email);
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.participationStage === 'completed') {
                    setAlertType('warning');
                    setAlertText(MSG.taskAlreadyComplete);
                    return;
                }
            }
        } catch (checkError) {
            console.error('Unexpected Error on getDoc:', checkError);
            setAlertType('error');
            setAlertText(MSG.databaseAccessError);
            return;
        }

        // Send link
        setSendingLink(true);
        const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            setLinkSent(true);
            
            emailInputRef.current?.blur();
            setAlertType('success');
            const message = (<>
                A sign-in link email has been sent 
                to <strong>{email}</strong> from:<br />
                <strong>{FIREBASE_EMAIL}</strong><br />
                <br />
                Please click the link <strong>{PROJECT_LINK}</strong> in 
                that email to finish the sign-in.<br />
                <br />
                You may need to check your Spam folder if it's not in your inbox.
                Please email <strong>{KS_EMAIL}</strong> if you have any issues or questions.
            </>);
            setAlertText(message);

            // Write the first document for user
            const userDocRef = doc(db, 'participants', email);
            await setDoc(userDocRef, {
                uid: null,
                email,
                firstName,
                lastName,
                participationStage: 'sentLink',
                timeStamp: {
                    sentLink: serverTimestamp(),
                    startTest: null,
                    uploadCsv: null
                },
                csvFileName: null
            });
        } catch (error) {
            console.error('Error sending link:', error);
            setAlertType('error');
            setAlertText(MSG.sentLinkFailError);
        } finally {
            setSendingLink(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!isValidEmail(signInEmail)) {
            setAlertType('error');
            setAlertText(MSG.emailFormatError);
            return;
        }
        setLoadingConfirm(true);
        try {
            const result = await signInWithEmailLink(auth, signInEmail, window.location.href);
            const email = result.user.email;
            docRef.current = doc(db, 'participants', email);
            const docSnap = await getDoc(docRef.current);

            if (!docSnap.exists()) {
                setAlertType('error');
                setAlertText(MSG.noUserDoc);
                return;
            }

            // Append uid to doc
            const data = docSnap.data();
            await updateDoc(docRef.current, { uid: result.user.uid });

            // Update metadata
            metaData.current.firstName = data.firstName;
            metaData.current.lastName = data.lastName;
            metaData.current.email = data.email;
            
            setAlertType('success');
            setAlertText(`Welcome, ${data.firstName} ${data.lastName}!`);

            setValidated(true);
        } catch (error) {
            console.error('Sign-in failed:', error);
            setAlertType('error');
            setAlertText(MSG.authFailError);
        } finally {
            setLoadingConfirm(false);
        }
    };

    
    const renderSignUpForm = () => (
        <>
            <Input 
                placeholder='First Name' 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                size='large' 
            />
            <Input 
                placeholder='Last Name' 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                size='large' 
            />
            <Input 
                type='email' 
                placeholder='Enter your email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                ref={emailInputRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSendLink();
                    }
                }}
                size='large' 
            />
        </>
    );

    const renderSignInForm = () => (
        <>
            <Input 
                type='email' 
                placeholder='Enter your email to complete sign-in' 
                value={signInEmail} 
                onChange={(e) => setSignInEmail(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleVerifyEmail();
                    }
                }}
                size='large' 
            />
            
        </>
    );

    const confirmSignInButton = () => (
        <Button 
            type='primary' 
            onClick={handleVerifyEmail} 
            loading={loadingConfirm}
            block style={{ fontWeight: 'bold', height: '40px' }}
            disabled={!signInEmail}
        >
            Confirm Email to Sign In
        </Button>
    );

    
    const sendSignInLinkButton = () => {
        const disableFlag = (
            !email.trim() || !firstName.trim() || !lastName.trim() 
            || linkSent || alertType !== 'info'
        );

        return (
            <Button
                type='primary'
                onClick={handleSendLink}
                loading={sendingLink}
                disabled={disableFlag}
                block
                style={{ fontWeight: disableFlag ? 'normal' : 'bold', height: '40px' }}
            >
                Send Sign-In Link
            </Button>
        );
    };


    const handleEnterTest = async () => {
        metaData.current.startTime = new Date();
        try {
            await updateDoc(docRef.current, {
                'participationStage': 'inProgress',
                'timeStamp.startTest': serverTimestamp()
            });

            console.log("Firestore updated with start time.");
        } catch (error) {
            console.error("Failed to update start time:", error);
        }
        setStage(APP_STAGE.instruction);
    };

    const enterTheTestButton = () => (
        <Button
            type='primary'
            onClick={handleEnterTest}
            style={{ fontWeight: 'bold', height: '40px' }}
            block
        >
            Enter the Test
        </Button>
    );

    const displayAlert = () => {
        if (isSigningIn && alertType === 'info') return null;
        
        const alert_s = { textAlign: linkSent ? 'left' : 'center'};
        const div_s = { height: '40px', visibility: 'hidden' };
        switch (alertType) {
            case null:
                return isSigningIn ? null : <div style={div_s} />;
            default:
                return <Alert 
                    style={alert_s} 
                    message={alertText} 
                    type={alertType} 
                    showIcon 
                />;
        }
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <div style={titleStyle}>Paper Folding Test</div>
                <Space direction='vertical' size='large' style={{ width: '100%' }}>
                    {(!validated && !isSigningIn) && renderSignUpForm()}
                    {(!validated &&  isSigningIn) && renderSignInForm()}
                    {displayAlert()}
                    {(!validated && !isSigningIn) && sendSignInLinkButton()}
                    {(!validated &&  isSigningIn && alertType !== 'error') && confirmSignInButton()}
                    {(validated && alertType === 'success') && enterTheTestButton()}
                </Space>
            </div>
        </div>
    );
}

export default FirebaseEmailLogin;

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
};

const boxStyle = {
    width: 400,
    textAlign: 'center',
    padding: 30,
    border: '1px solid rgb(255, 255, 255)',
    borderRadius: 8,
    background: 'linear-gradient(to bottom right, rgb(147, 200, 220), rgb(246, 233, 212))',
    boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3)',
};

const titleStyle = {
    marginTop: '20px',
    marginBottom: '50px',
    fontSize: '36px',
    fontWeight: 'bolder',
    color: 'rgb(255, 255, 255)',
};
