import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import CodeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageMyCode() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const userLevel = secureStorage.getItem('level');

    //유저가 아닐 경우 접근 막기
    useEffect(() => {
        if(!userNick || userNick === null) navigate('/');
        async function getCode() {
            const box = document.getElementById('codeList');
            const data = await getCodeList();
            let code = '';
            for (let e in data) {
                const { idx, title, desc, tag, date } = data[e];
                code += '<li><a href="/mypage/myCodeEdit?idx=' + idx + '">'
                        +    '<h4><i class="' + tag + '">' + tag + '</i> ' + title + "</h4>"
                        +    '<p class="date">' + date + '</p>'
                        +    '<p class="desc">' + desc + '</p>'
                        //+    "<div id='code" + Number(e + 1) + "' class='code javascript'>" + CodeEditor(codeData.context) + "</div>"
                        + "</a></li>";
                
            }
            if (code === '') {
                box.innerHTML = '<li class="pt-10 pb-10 text-center">아직 작성한 code가 없습니다</li>';
    
            } else {
                box.innerHTML = code;
            }
        }
        getCode();
    }, [])

    async function getCodeList() {
        
        const res = await fetch('/api/getCode', {
            method: 'POST',
            body: JSON.stringify({ userID: userID }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        
        return data;
    }


    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className='category text-center'>
                    <p className='blind'>카테고리 선택</p>
                    <a href='/mypage'>favorite</a>
                    <a href='/mypage/cheatSheet'>cheat sheet</a>
                    <a href='/mypage/myCode' className='on'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 code</h2>
                    <ul id='codeList' className="codeList mt-3"></ul>
                    <div className='btnGroup text-center mt-3'>
                        <a href='/mypage/myCodeEdit' className='btn apply'>code 작성</a>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}