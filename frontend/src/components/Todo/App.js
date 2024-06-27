//App.js

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';
import Sidebar from './components/Sidebar';


function App() {
  const headStyle = {
    textAlign: "center",
  }
  return (
    <div>
      <Sidebar />
      <h1 style={headStyle}>ToDo List</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Todo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
