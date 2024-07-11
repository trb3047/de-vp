import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageJoin() {
    //useState는 react에서 제공하는 함수로 설정한 [0]의 키에 [1] 함수로 데이터를 담을 수 있다
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [email, setEmail] = useState('');
    //중복검사
    const [okId, setOkId] = useState(false);
    const [okNick, setOkNick] = useState(false);

    const navigate = useNavigate();
    
    const idCheck = async () => {
        try {
            //유효성 체크
            const idReg = /[a-z0-9]{4,16}/;
            if(!idReg.test(id)) return alert('영문, 숫자를 사용한 4~16자리 ID를 입력해 주세요');

            const input = document.getElementById('id');
            const res = await fetch('/api/idCheck', {
                method: 'POST',
                body: JSON.stringify({ userID: id }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            //중복 체크 초기화
            setOkId(false);

            //id 사용 가능
            if (res.status === 200) {
                alert(data);
                input.className = 'input success';
                input.readOnly = true;
                setOkId(true);
            }
            //id 중복
            if (res.status === 401) {
                alert(data);
                input.className = 'input fail';
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    const nickCheck = async () => {
        try {
            //유효성 체크
            const Reg = /[a-z0-9가-힣]{2,16}/;
            if(!Reg.test(nick)) return alert('한글, 영문, 숫자를 사용한 2~16자리 닉네임을 입력해 주세요');

            const input = document.getElementById('nick');
            const res = await fetch('/api/nickCheck', {
                method: 'POST',
                body: JSON.stringify({ userNick: nick }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            //중복 체크 초기화
            setOkNick(false);
            //사용 가능
            if (res.status === 200 && nick) {
                alert(data);
                input.className = 'input success';
                input.readOnly = true;
                setOkNick(true);
            }
            //중복
            if (res.status === 401) {
                alert(data);
                input.className = 'input fail';
            }
            
        }
        catch(err) {
            console.log(err);
        }
    }

    const submit = async () => {
        //유효성 체크
        const pwReg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
        const emailReg = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

        //회원가입 정보 체크 
        if (!okId) return alert('ID 중복 확인을 해 주세요');
        if (!okNick) return alert('닉네임 중복 확인을 해 주세요');
        if (!pwReg.test(pw)) return alert('8~16자리의 영문, 숫자, 특수문자를 조합해야 합니다');
        if (pw !== pw2) return alert('비밀번호가 일치하지 않습니다');
        if (!email) return alert('이메일 주소를 입력해 주세요');
        if (!emailReg.test(email)) return alert('이메일 형식을 맞춰서 입력해 주세요');

        try {
            //회원가입 정보를 해당 경로로 보내기
            //미리 설정해놓은 라우터가 받음, 포트 관련 문제 발생 시 프록시 설정하기
            const res = await fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify({ userID: id, userPW: pw, userNick: nick, userEmail: email, level: 1 }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            //라우터를 통해 컨트롤러에서 답변을 json으로 받아옴
            const data = await res.json();

            //가입 성공, 메인페이지로 리다이렉트
            if (res.status === 200) {
                alert(data);
                navigate('/login');
            }
        } 
        //에러 처리, 이 경우에는 브라우저 콘솔에 나온다
        catch(err) {
            console.log(err);
        }
    }

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className="max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">회원가입</h2>
                    <ul className="inputBox mt-5">
                        <li><label htmlFor="id">ID</label>
                            <input type="text" id="id" placeholder="ID" className="input" maxLength={16} value={id} onChange={(e) => setId(e.target.value)} />
                            <p className="w-full float-left mt-2">
                                <span className='float-left mt-2 mb-2'>영문, 숫자를 조합해 만들 수 있습니다.</span>
                                <button className='float-right btn apply' onClick={idCheck}>중복확인</button>
                            </p>
                        </li>
                        <li><label htmlFor="id">닉네임</label>
                            <input type="text" id="nick" placeholder="닉네임" className="input" maxLength={16} value={nick} onChange={(e) => setNick(e.target.value)} />
                            <p className="w-full float-left mt-2">
                                <button className='float-right btn apply' onClick={nickCheck}>중복확인</button>
                            </p>
                        </li>
                        <li><label htmlFor="password">비밀번호</label>
                            <input type="password" id="password" placeholder="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
                            <p className="w-full float-left mt-2">영문, 숫자, 특수문자를 조합한 8자리 이상의 비밀번호를 입력해주세요.</p>
        
                        </li>
                        <li><label htmlFor="passwordCheck">비밀번호 확인</label>
                            <input type="password" id="passwordCheck" placeholder="passwordCheck" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} />
                            <p className="w-full float-left mt-2">위와 동일한 비밀번호를 입력해주세요.</p>
                        </li>
                        <li><label htmlFor="email">email</label>
                            <input type="text" id="email" placeholder="email address" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <p className="w-full float-left mt-2">영문,숫자,특수문자를 조합한 8자리 이상의 비밀번호를 입력해주세요.</p>
        
                        </li>
                    </ul>
                    <div className="btnGroup mt-5">
                        <a href="/" className="btn">취소</a>
                        <button className='btn join' onClick={submit}>회원가입</button>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}