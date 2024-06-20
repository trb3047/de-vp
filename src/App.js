import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//component
import CodeList from './jsx/code/list.js';
import PageContact from './jsx/contact.js';
//user
import PageJoin from './jsx/mypage/join.js';
import PageLogin from './jsx/mypage/login.js';
import PageLogout from './jsx/mypage/logout.js';
import PageFindID from './jsx/mypage/findID.js';
import PageFindIdResult from './jsx/mypage/findIdResult.js';
import PageFindPW from './jsx/mypage/findPW.js';
import PageFindPwResult from './jsx/mypage/findPwResult.js';
import PageMypage from './jsx/mypage/myFavorite.js';
import PageMyCheat from './jsx/mypage/myCheatSheet.js';
import PageMyCode from './jsx/mypage/myCode.js';
import PageMyCodeAdd from './jsx/mypage/myCodeAdd.js';
import PageMyCodeEdit from './jsx/mypage/myCodeEdit.js';
import PageCodeView from './jsx/code/view.js';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CodeList />}></Route>
        <Route path='/senior' element={<CodeList />}></Route>
        <Route path='/junior' element={<CodeList />}></Route>
        <Route path='/join' element={<PageJoin />}></Route>
        <Route path='/login' element={<PageLogin />}></Route>
        <Route path='/logout' element={<PageLogout />}></Route>
        <Route path='/FindID' element={<PageFindID />}></Route>
        <Route path='/FindIdResult' element={<PageFindIdResult />}></Route>
        <Route path='/FindPW' element={<PageFindPW />}></Route>
        <Route path='/FindPwResult' element={<PageFindPwResult />}></Route>
        <Route path='/mypage' element={<PageMypage />}></Route>
        <Route path='/mypage/cheatSheet' element={<PageMyCheat />}></Route>
        <Route path='/mypage/myCode' element={<PageMyCode />}></Route>
        <Route path='/mypage/myCodeAdd' element={<PageMyCodeAdd />}></Route>
        <Route path='/mypage/myCodeEdit' element={<PageMyCodeEdit />}></Route>
        <Route path='/code' element={<PageCodeView />}></Route>
        <Route path='/contact' element={<PageContact />}></Route>
      </Routes>
    </Router>
  );
}
