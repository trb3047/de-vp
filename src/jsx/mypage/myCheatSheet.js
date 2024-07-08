import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';
import CodeEditor from '../../js/editor.js';

export default function PageMyCheat() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const pageTag = new URL(window.location.href).searchParams.get('tag');

    useEffect(() => {
        //유저가 아닐 경우 접근 막기
        if(!userNick || userNick === null) navigate('/');

        async function getCode() {
            const box = document.getElementById('codeList');
            const navCode = document.getElementById('navCode');
            const data = await getCodeList();
            let code = '';
            let nav = '';
            for (let e in data) {
                let { idx, title, desc, tag, date, userNick, editor, context } = data[e];
                if(!editor) editor = 'JS';

                code += '<li class="' + tag + '" id="code' + (Number(e) + 1) + '">'
                        +    '<h4><i class="' + tag + '">' + tag +  '</i> ' + title + "</h4>"
                        +    '<p class="desc">' + desc + '</p>'
                        +    "<div class='codeBox'><div class='code " + editor + "'>" + CodeEditor(context) + "</div></div>"
                        + "</li>";
                
                nav += `<dd class='${tag}' data-idx='${idx}'><a href='#code${Number(e) + 1}'>${title}</a></dd>`;
            }
            if (code === '') {
                box.innerHTML = '<li class="noResult">아직 등록한 code가 없습니다</li>';
    
            } else {
                box.innerHTML = code;
                navCode.innerHTML = `<dt>code 바로가기</dt>` + nav;
                //+ `<dd class='btnBox'><button class='btn apply'>순서 수정하기</button></dd>`
            }
        }
        
        async function getCodeList() {
            
            const res = await fetch('/api/getCodeFavorite', {
                method: 'POST',
                body: JSON.stringify({ userID: userID }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            let data = await res.json();
            
            if (res.status === 200) return data;
        }

        getCode();
    }, [])
    
    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className='category text-center'>
                    <p className='blind'>카테고리 선택</p>
                    <a href='/mypage'>favorite</a>
                    <a href='/mypage/cheatSheet?tag=JS' className='on'>cheat sheet</a>
                    <a href='/mypage/myCode'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 cheat sheet</h2>
                    <div className='category text-right mt-3 relative'>
                        <p className='blind'>대분류 선택</p>
                        <a id='tag_JS' href='/mypage/cheatSheet?tag=JS' className={pageTag === 'JS' ? 'on' : ''} >javascript</a>
                        <a id='tag_git' href='/mypage/cheatSheet?tag=git' className={pageTag === 'git' ? 'on' : ''} >git</a>
                        <a id='tag_linux' href='/mypage/cheatSheet?tag=linux' className={pageTag === 'linux' ? 'on' : ''} >linux</a>
                        <a id='tag_mysql' href='/mypage/cheatSheet?tag=mysql' className={pageTag === 'mysql' ? 'on' : ''} >mysql</a>
                        <a id='tag_FE' href='/mypage/cheatSheet?tag=FE' className={pageTag === 'FE' ? 'on' : ''} >frontend</a>
                        <a id='tag_BE' href='/mypage/cheatSheet?tag=BE' className={pageTag === 'BE' ? 'on' : ''} >backend</a>
                        <dl className='navCode' id='navCode'></dl>
                        <ul id='codeList' className="cheatSheet"></ul>
                    </div>
                    <p id='scrollNextPage'><span className='blind'>다음 목록 불러오기</span></p>
                    <div className='btnGroup overflow-hidden text-center mt-3'>
                        <a href='/' className='btn apply'>찾으러 가기</a>
                        <a href='#root' className='btn float-right btnGoRoot'>위로</a>
                    </div>
                </div>

            </main>
            <Footer />
        </React.StrictMode>
    );
}