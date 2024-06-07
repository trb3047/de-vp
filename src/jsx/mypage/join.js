import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageJoin() {
    //useState는 react에서 제공하는 함수로 설정한 [0]의 키에 [1] 함수로 데이터를 담을 수 있다
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    //설정한 경로로 리다이렉트 하는 기능
    const navigate = useNavigate();

    const submitBtn = async () => {
        //필수 요소 값이 피어 있을 경우
        if (id === '' || pw === '') {
            alert("아이디 또는 비밀번호를 입력해주세요");
            return;
        } 
        //필수 요소 값 입력 완료
        else {
            try {
                //회원가입 정보를 해당 경로로 보내기
                //미리 설정해놓은 라우터가 받음, 포트 관련 문제 발생 시 프록시 설정하기
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify({userID: id, userPW: pw, userEmail: email, userPhone: phone}),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                //라우터를 통해 컨트롤러에서 답변을 json으로 받아옴
                const data = await res.json();
                //가입 성공 or 실패 or id중복 체크 안내(별도 버튼으로 미리 확인할 수 있게 하면 좋을 듯)
                alert(data);
                //가입 성공시 메인페이지로 리다이렉트
                if (res.status === 200) {
                    navigate('/');
                } 
                //실패시 값 초기화
                else {
                    setId('');
                    setPw('');
                    setEmail('');
                    setPhone('');
                    return;
                }
            } 
            //에러 처리, 이 경우에는 브라우저 콘솔에 나온다
            catch(err) {
                console.log(err);
            }
        }
    }
    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className="max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">회원가입</h2>
                    <p className="text-left mt-2 mb-2">* 표시는 필수 입력 사항입니다.</p>
                    <ul className="inputBox">
                        <li><label htmlFor="id">* ID</label>
                            <input type="text" id="id" placeholder="ID" className="input" value={id} onChange={(e) => setId(e.target.value)} />
                            <p className="w-full float-left mt-2">
                                <span className="float-left mt-2">영문,숫자,특수문자(-)로 조합해 만들 수 있습니다.</span>
                                <button className="btn apply float-right">중복확인</button>
                            </p>
                        </li>
                        <li><label htmlFor="password">* 비밀번호</label>
                            <input type="password" id="password" placeholder="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
                            <p className="w-full float-left mt-2">영문,숫자,특수문자를 조합한 8자리 이상의 비밀번호를 입력해주세요.</p>
        
                        </li>
                        <li><label htmlFor="password">* 비밀번호 확인</label>
                            <input type="password" id="passwordCheck" placeholder="passwordCheck" className="input" />
                            <p className="w-full float-left mt-2">위와 동일한 비밀번호를 입력해주세요.</p>
                        </li>
                        <li><label htmlFor="password">이메일 주소</label>
                            <input type="text" id="emailAdress" placeholder="e-mail" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </li>
                        <li><label htmlFor="password">전화번호</label>
                            <input type="text" id="phoneNumber" placeholder="01012345678" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <p className="w-full float-left mt-2">휴대폰 번호를 입력해주세요.</p>
                        </li>
                    </ul>
                    <div className="btnGroup">
                        <a href="/" className="btn">취소</a>
                        <button className="btn join" onClick={submitBtn}>회원가입</button>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}