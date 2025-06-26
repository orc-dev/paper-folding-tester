import { useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import { useTestContext } from './TestContext';

const { Title, Paragraph } = Typography;

function HelpMenu() {
    const { 
        APP_STAGE, stageRef, objHoverOn, objRef, modalPop 
    } = useTestContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleMouseEnter = () => {
        if (stageRef.current !== APP_STAGE.test) {
            return;
        }
        objHoverOn.current = 'HELP';
    };

    const handleMouseLeave = () => {
        if (stageRef.current !== APP_STAGE.test) {
            return;
        }
        objHoverOn.current = 'none';
    };

    const button_s = {
        position: 'absolute',
        top: '60px',
        right: '80px',
        fontSize: 32,
        fontWeight: 'bolder',
        color: 'rgb(255, 255, 255)',
        width: 60,
        height: 60,
        padding: 0,
        textAlign: 'center',
        border: '5px solid rgb(165, 197, 209)',
    };

    const title_s = { textAlign: 'center', marginBottom: '30px' };
    const div_s = {
        backgroundColor: 'rgb(213, 222, 225)',
        borderRadius: '8px',
        padding: '20px',
        paddingLeft: '30px',
        paddingRight: '30px',
        marginBottom: '15px',
    };

    const helpButton = () => (
        <Button
            ref={(el) => objRef.current.HELP = el}
            type='primary'
            shape='circle'
            onClick={() => {
                setIsModalOpen(true);
                modalPop.current = true;
            }}
            style={button_s}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
        >
            ?
        </Button>
    );

    return (
        <>
            {helpButton()}
            <Modal
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    modalPop.current = false;
                }}
                footer={null}
                width={900}
                centered
            >
                <Typography>
                    <Title level={3} style={title_s}>Test Instruction Review</Title>
                    <div style={div_s}>
                        <Paragraph style={{ fontSize: '16px' }}>
                            In this test, you'll imagine how a piece of paper is folded and 
                            then unfolded after being punched with a hole. Each question presents 
                            a sequence of diagrams showing the folding process.
                        </Paragraph>
                        <ul style={{ fontSize: '16px' }}>
                            <li>The <strong>dashed line</strong> marks the original paper's boundary</li>
                            <li>The <strong>solid line</strong> shows the current fold</li>
                            <li>The <strong> final diagram</strong> indicates where the hole is punched</li>
                        </ul>

                        <Paragraph style={{ fontSize: '16px' }}>
                            Your task is to select the option that correctly shows where 
                            the holes will appear after the paper is <strong>completely unfolded</strong>.
                        </Paragraph>

                        <Paragraph style={{ fontSize: '16px' }}>
                            Your score on this test will be the number marked correctly 
                            minus a fraction of the number marked incorrectly. Therefore, 
                            it will not be to your advantage to guess unless you are able 
                            to eliminate one or more of the answer choices as wrong.
                        </Paragraph>
                    </div>
                </Typography>
            </Modal>
        </>
    );
}

export default HelpMenu;