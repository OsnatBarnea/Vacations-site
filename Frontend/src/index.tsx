import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Components/LayoutArea/Layout/Layout';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { notify } from './Utils/Notify';
import { interceptor } from './Utils/Interceptor';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

//get the interceptor to start automatically 
(async () => {
    try {
        interceptor.registerInterceptor();
    }
    catch (err: any) { notify.error(err) }
})();

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
