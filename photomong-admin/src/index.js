import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginPage from './Page/LoginPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './Layout/DashboardLayout';
import AllDevice from './Content/AllDevice';
import AddDevice from './Content/AddDevice';
import EditDevice from './Content/EditDevice';
const router = createBrowserRouter(

  [
  // //첫페이지->로그인
  // { 
  //   element: <InitPage/>, path: "/" },
  { 
    element: <LoginPage />, path: "/" },
    {
      element:<DashboardLayout />,
      //내부 화면만 교체
      children:[
       
         {
          
      path: "/all-devices",
      element: <AllDevice/>,
    },
    {
          
      path: "/add-device",
      element: <AddDevice/>,
    },
    {
          
      path: "/edit-device/:id",
      element: <EditDevice/>,
    },

],}]

);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
   <RouterProvider   router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
