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
        try {
            if (!id) return alert('ID를 입력해 주세요');
            if (!pw) return alert('비밀번호를 입력해 주세요');

            const res = await fetch('/api/loginCheck', {
                method: 'POST',
                body: JSON.stringify({ userID: id, userPW: pw }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            //로그인 실패
            if (res.status === 401) return alert(data);
            //로그인 성공
            if (res.status === 200) {
                //차단 된 ID 로그인 처리
                if (data.level === 0) return alert('차단 된 ID입니다');
            
                //암호화하고 데이터 저장
                secureStorage.setItem('id', data.userID);
                secureStorage.setItem('nick', data.userNick);
                secureStorage.setItem('level', data.level);
                secureStorage.setItem('ad', data.admin);
                navigate('/');
            }

        } catch(err) {
            console.log(err);
        }
        
    }

    return (    
        <>
            <Header />
            <main>
                <form action='javascript:;' onSubmit={loginSubmit}>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">로그인</h2>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="id">ID</label><input type="text" id="id" placeholder="ID" className="input" value={id} onChange={(e) => setId(e.target.value)} /></li>
                        <li><label htmlFor="password">비밀번호</label><input type="password" id="password" placeholder="password" value={pw} className="input" onChange={(e) => setPw(e.target.value)} /></li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-5">
                        <a href="/findID" className='hover:underline'>ID 찾기</a>
                        <span> / </span>
                        <a href="/findPW" className='hover:underline'>비밀번호 찾기</a>
                    </p>
                    <div className="btnGroup mt-5">
                        <input type='submit' value='로그인' className='btn apply' />
                        <a href="/join" className="btn join">회원가입</a>
                    </div>
                </div>
                </form>
            </main>
            <Footer />
        </>
    );
}