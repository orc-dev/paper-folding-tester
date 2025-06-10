import { Button } from 'antd';


function TestDataUploader() {
    const message = 'Congratulations! You have completed the test. Thank you!';
    const downloadCSV = () => {
        console.log('downloading...');
    };

    return (
        <div style={styles.localTopDiv}>
            <div style={styles.textDiv}>
                {message}
            </div>
            <Button 
                type='primary' 
                onClick={downloadCSV} 
                style={styles.downloadButton}
            >
                Download CSV Data
            </Button>
        </div>
    );
}

export default TestDataUploader;

const styles = {
    localTopDiv: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
    },
    textDiv: {
        width: '80vw',
        marginTop: '30vh',
        marginBottom: '20vh',
        color: '#333',
        fontSize: '50px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    downloadButton: {
        width: '350px',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        padding: '10px 20px',
    },
};