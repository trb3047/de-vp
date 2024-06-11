import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageLogin() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;

    const loginSubmit = async () => {
        if(!id) return alert('ID를 입력해 주세요');
        if(!pw) return alert('비밀번호를 입력해 주세요');

        try {
            const res = await fetch('/api/loginCheck', {
                method: 'POST',
                body: JSON.stringify({userID: id, userPW: pw}),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();
            //로그인 성공
            if (res.status === 200) {
                //암호화하고 데이터 저장
                secureStorage.setItem('nick', data.userNick);
                secureStorage.setItem('email', data.userEmail);
                secureStorage.setItem('level', data.level);
                navigate('/');
            }

        } catch(err) {
            console.log(err);
        }
        
    }

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl text-center">로그인</h2>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="id">ID</label><input type="text" id="id" placeholder="ID" className="input" value={id} onChange={(e) => setId(e.target.value)} /></li>
                        <li><label htmlFor="password">비밀번호</label><input type="password" id="password" placeholder="password" value={pw} className="input" onChange={(e) => setPw(e.target.value)} /></li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-5">
                        <a href="#" className='hover:underline'>ID 찾기</a>
                        <span> / </span>
                        <a href="#" className='hover:underline'>비밀번호 찾기</a>
                    </p>
                    <div className="btnGroup mt-5">
                        <button className="btn apply" onClick={loginSubmit}>로그인</button>
                        <a href="/join" className="btn join">회원가입</a>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}