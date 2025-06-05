import ReactDOM from 'react-dom/client';
import { TestContextProvider } from './components/TestContext';
import App from './App';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <TestContextProvider>
        <App />
    </TestContextProvider>
);
