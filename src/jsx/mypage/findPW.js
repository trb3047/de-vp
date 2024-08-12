import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageFindPW() {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;

    async function findPwSubmit() {
        try {
            if (!id) return alert('ID를 입력해 주세요');
            if (!email) return alert('email 주소를 입력해 주세요');

            const res = await fetch('/api/findPW', {
                method: 'POST',
                body: JSON.stringify({ userID: id, userEmail: email }),
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
                navigate('/findPwResult');
            }

        } catch(err) {
            console.log(err);
        }
        
    }

    return (    
        <>
            <Header />
            <main>
                <form action='javscript:;' onSubmit={findPwSubmit}>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">비밀번호 찾기</h2>
                    <p className='mt-5'>가입한 ID와 email 주소로 비밀번호를 찾을 수 있습니다.</p>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="id">ID</label><input type="text" id="id" placeholder="ID" className="input" value={id} onChange={(e) => setId(e.target.value)} /></li>
                        <li><label htmlFor="email">email</label><input type="text" id="email" placeholder="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-5">
                        <a href="/findID" className='hover:underline'>ID 찾기</a>
                    </p>
                    <div className="btnGroup mt-5">
                        <input type='submit' value='비밀번호 찾기' className='btn apply' />
                    </div>
                </div>
                </form>
            </main>
            <Footer />
        </>
    );
}