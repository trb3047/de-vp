import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageLogin() {
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;
    const getID = secureStorage.getItem('userID');

    const findPwSubmit = async () => {
        try {
            //유효성 체크
            const pwReg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
            if (!pwReg.test(pw)) return alert('8~16자리의 영문, 숫자, 특수문자를 조합해야 합니다');
            if (pw !== pw2) return alert('비밀번호를 확인해 주세요');

            const res = await fetch('/api/editPW', {
                method: 'POST',
                body: JSON.stringify({ userID: getID, userPW: pw }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            //비밀번호 변경 실패
            if (res.status === 500) return alert('비밀번호 변경 실패');
            //비밀번호 변경 성공
            if (res.status === 200) {
                //데이터 삭제
                secureStorage.clear();
                alert(data);
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
                <form action='javscript:;' onSubmit={findPwSubmit}>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">비밀번호 변경</h2>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="password">새 비밀번호</label><input type="password" id="password" placeholder="password" value={pw} className="input" onChange={(e) => setPw(e.target.value)} /></li>
                        <li><label htmlFor="password2">비밀번호 확인</label><input type="password" id="password2" placeholder="password" value={pw2} className="input" onChange={(e) => setPw2(e.target.value)} /></li>
                    </ul>
                    <div className="btnGroup mt-5">
                        <input type='submit' value='변경' className='btn apply' />
                    </div>
                </div>
                </form>
            </main>
            <Footer />
        </>
    );
}