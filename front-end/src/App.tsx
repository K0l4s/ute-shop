import React from 'react';
import logo from './logo.svg';
import './App.css';
import Router from './router/Router';
import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <>
    <Navbar />
    <Router />
    </>
  );
}

export default App;
