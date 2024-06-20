import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageFindID() {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;

    async function findIdSubmit() {
        try {
            if (!email) return alert('email 주소를 입력해 주세요');
            if (!pw) return alert('비밀번호를 입력해 주세요');

            const res = await fetch('/api/findID', {
                method: 'POST',
                body: JSON.stringify({ userEmail: email, userPW: pw }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            
            //찾기 실패
            if (res.status === 401) return alert(data);
            //찾기 성공
            if (res.status === 200) {
                //암호화하고 데이터 저장
                secureStorage.setItem('userID', data.userID);
                navigate('/findIdResult');
            }

        } catch(err) {
            console.log(err);
        }
        
    }

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <form action='javscript:;' onSubmit={findIdSubmit}>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">ID 찾기</h2>
                    <p className='mt-5'>가입한 email 주소로 ID를 찾을 수 있습니다.</p>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="email">email</label><input type="text" id="email" placeholder="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></li>
                        <li><label htmlFor="password">비밀번호</label><input type="password" id="password" placeholder="password" value={pw} className="input" onChange={(e) => setPw(e.target.value)} /></li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-5">
                        <a href="/findPW" className='hover:underline'>비밀번호 찾기</a>
                    </p>
                    <div className="btnGroup mt-5">
                        <input type='submit' value='ID 찾기' className='btn apply' />
                    </div>
                </div>
                </form>
            </main>
            <Footer />
        </React.StrictMode>
    );
}