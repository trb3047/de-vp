import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//component
import CodeList from './jsx/code/list.js';
import PageContact from './jsx/contact.js';
//user
import PageJoin from './jsx/mypage/join.js';
import PageLogin from './jsx/mypage/login.js';
import PageLogout from './jsx/mypage/logout.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CodeList />}></Route>
        <Route path='/join' element={<PageJoin />}></Route>
        <Route path='/login' element={<PageLogin />}></Route>
        <Route path='/logout' element={<PageLogout />}></Route>
        <Route path='/contact' element={<PageContact />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
