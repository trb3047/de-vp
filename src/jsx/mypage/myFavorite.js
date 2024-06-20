import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageMypage() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userNick = secureStorage.getItem('nick');
    const userLevel = secureStorage.getItem('level');

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className='category text-center'>
                    <p className='blind'>카테고리 선택</p>
                    <a href='/mypage' className='on'>favorite</a>
                    <a href='/mypage/cheatSheet'>cheat sheet</a>
                    <a href='/mypage/myCode'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 favorite code</h2>
                    <p className='pt-10 pb-10 text-center'>아직 즐겨찾기한 code가 없습니다</p>
                    <div className='btnGroup text-center'>
                        <a href='/' className='btn apply'>찾으러 가기</a>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}