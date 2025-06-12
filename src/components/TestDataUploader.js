import { useState, useEffect, useRef } from 'react';
import { useTestContext } from './TestContext';
import { GAS_URL, ACTION, CSV_HEADER } from '../constants/config';
import { Spin, Alert, Button } from 'antd';

const metaDataLabel = Object.freeze({
    pid: 'PID',
    firstName: 'First_Name',
    lastName: 'Last_Name',
    email: 'Email',
    startTime: 'Start_Time',
    theme: 'Theme',
    answer1: 'Answer_1',
    answer2: 'Answer_2',
    score1: 'Score_1',
    score2: 'Score_2',
});

function TestDataUploader() {

    const { metaData, csvDataBuf } = useTestContext();
    const fileName = useRef('??.csv');
    const [taskDone, setTaskDone] = useState(false);
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    
    const generateFileName = (isDownloaded = false) => {
        const id = metaData.current.pid;
        const F = metaData.current.firstName.charAt(0).toUpperCase();
        const L = metaData.current.lastName.charAt(0).toUpperCase();
        const now = new Date();
        const month  = String(now.getMonth() + 1).padStart(2, '0');
        const day    = String(now.getDate()).padStart(2, '0');
        const hour   = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const suffix = isDownloaded ? '_DL.csv' : '.csv';
        return `${id}_${F}${L}_${month}${day}_${hour}${minute}${suffix}`;
    }

    const generateCSVContent = () => {
        const csvContentArray = [
            Object.entries(metaData.current)
                .map(([key, value]) => `# ${metaDataLabel[key]}: ${value}`)
                .join('\n'),
            '---',
            Object.keys(CSV_HEADER).join(','), 
            csvDataBuf.current.map(row => row.join(',')).join('\n')
        ];
        return csvContentArray.join('\n');
    };

    const sendCSVToDrive = () => {
        fileName.current = generateFileName();
        const csvContent = generateCSVContent();

        fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            redirect: 'follow',
            headers: { 
                'Content-Type': 'text/plain;charset=utf-8',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                fileName: fileName.current, 
                csvContent, 
                emailAddress: metaData.current.email,
            }),
        })
        .then(() => {
            console.log('Tasks have been finished and ready to check.');
            setTaskDone(true);
        })
        .catch(error => {
            console.error('Error: ', error);
            setStatus('error');
        });
    };
    
    const verifyCSVUpload = () => {
        const action = ACTION.completionVerification;
        const encodedEmail = encodeURIComponent(metaData.current.email);

        fetch(`${GAS_URL}?action=${action}&email=${encodedEmail}&fileName=${fileName.current}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Verification failed: ', data.message);
                    setStatus('error');
                    return;
                }
                if (data.taskCompleted && data.fileExists) {
                    console.log('Task completed and file successfully uploaded!');
                    setStatus('success');
                    return;
                }
                console.warn('Task marked as completed, but file not found.');
                setStatus('error');
            })
            .catch(error => {
                console.error('Error checking upload status: ', error);
                setStatus('error');
            });
    };

    useEffect(() => {
        // Set a timeout to trigger the manual download option if no response
        const timeoutTimer = setTimeout(() => {
            setStatus(prevStatus => {
                if (prevStatus === 'loading') {
                    console.log('status is set to TIMEOUT.');
                    return 'error';
                }
                return prevStatus; // If status changed, keep the latest value
            });
        }, 20000); // 20 seconds timeout

        return () => {
            clearTimeout(timeoutTimer);
        };
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!taskDone) {
            sendCSVToDrive();
            return;
        }
        const verifyTimer = setTimeout(() => {
            verifyCSVUpload();
        }, 2000);

        return () => {
            clearTimeout(verifyTimer);
        };
    // eslint-disable-next-line
    }, [taskDone]);

    const downloadCSV = () => {
        const csvContent = generateCSVContent();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = generateFileName(true);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const message = (
        <div style={styles.msgDiv}>
            Congratulations! You have completed the test. Thank you!
        </div>
    );
 
    const alertSpin = (
        <Spin size='large'>
            <Alert 
                message='Uploading data... Please wait.'
                type='info' 
                showIcon 
                style={styles.alert}
            />
        </Spin>
    );

    const alertSuccess = (
        <Alert 
            message='Your data has been saved. You are safe to quit the app.' 
            type='success'
            showIcon 
            style={styles.alert}
        />
    );

    const alertBusy = (
        <Alert 
            message='Network is busy, please manually download the CSV file.'
            type='warning'
            showIcon 
            style={styles.alert}
        />
    );

    const downLoadButton = (
        <Button 
            type='primary' 
            onClick={downloadCSV} 
            style={styles.downloadButton}
        >
            Download CSV Data
        </Button>
    );

    return (
        <div style={styles.outerDiv}>
            {message}
            <div style={styles.alertDiv}>
                {status === 'loading' && alertSpin}
                {status === 'success' && alertSuccess}
                {(status === 'error') && (<>
                    {alertBusy}
                    {downLoadButton}
                </>)}
            </div>
        </div>
    );
}

export default TestDataUploader;

const styles = {
    outerDiv: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
    },
    msgDiv: {
        width: '80vw',
        marginTop: '25vh',
        color: '#333',
        fontSize: '50px',
        fontWeight: 'bold',
    },
    alertDiv: { 
        width: '500px', 
        margin: 'auto', 
        marginTop: '135px' 
    },
    downloadButton: {
        width: '500px',
        height: '40px',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 20px',
        marginTop: '20px',
        borderRadius: '8px',
    },
};
