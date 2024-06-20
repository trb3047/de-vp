import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageMyCheat() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userNick = secureStorage.getItem('nick');
    const userLevel = secureStorage.getItem('level');
    
    useEffect(() => {
        //유저가 아닐 경우 접근 막기
        if(!userNick || userNick === null) navigate('/');
    }, [])

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className='category text-center'>
                    <p className='blind'>카테고리 선택</p>
                    <a href='/mypage'>favorite</a>
                    <a href='/mypage/cheatSheet' className='on'>cheat sheet</a>
                    <a href='/mypage/myCode'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 cheat sheet</h2>
                    <p className='pt-10 pb-10 text-center'>아직 등록한 code가 없습니다</p>
                    <div className='btnGroup text-center'>
                        <a href='/' className='btn apply'>찾으러 가기</a>
                    </div>
                </div>

            </main>
            <Footer />
        </React.StrictMode>
    );
}