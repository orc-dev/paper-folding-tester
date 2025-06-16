import { useState } from 'react';
import { auth } from '../constants/firebaseConfig';
import { sendSignInLinkToEmail } from 'firebase/auth';

const SignUpForm = () => {
    const [email, setEmail] = useState("");

    const handleSendLink = async () => {
        const actionCodeSettings = {
        url: window.location.href, // Current page will handle sign-in
        handleCodeInApp: true,
        };

        try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem("emailForSignIn", email);
        alert("Email sent! Check your inbox.");
        } catch (error) {
        console.error("Error sending email link", error);
        }
    };

    return (
        <div>
        <h2>Join the Paper Folding Test</h2>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
        />
        <button onClick={handleSendLink}>Send Sign-In Link</button>
        </div>
    );
};

export default SignUpForm;
