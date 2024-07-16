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

    async function getCode() {
        try {
            const box = document.getElementById('codeList');
            const navCode = document.getElementById('navCode');
    
            const data = await getCodeList();
            let code = '';
            let nav = '';
            for (let e in data) {
                let { idx, title, desc, tag, editor, context, tagColor } = data[e];
                if(!editor) editor = 'JS';
                if(tag === pageTag) {
                    code += '<li id="code' + (Number(e) + 1) + '">'
                            +    `<h4><i class='icon' style='background-color:${tagColor}'>${tag}</i> ${title}</h4>`
                            +    '<p class="desc">' + desc + '</p>'
                            +    "<div class='codeBox'><div class='code " + editor + "'>" + CodeEditor(context) + "</div></div>"
                            + '</li>';
                    
                    nav += `<dd data-idx='${idx}'><a href='#code${Number(e) + 1}'>${title}</a></dd>`;
                }
            }
            
            box.innerHTML = (code === '') ? '<li class="noResult">아직 등록한 code가 없습니다</li>' : code;
            navCode.innerHTML = `<dt>code 바로가기</dt>` + nav;
            //+ `<dd class='btnBox'><button class='btn apply'>순서 수정하기</button></dd>`
        } catch (err) {
            console.log(err);
        }
    }
    
    async function getCodeList() {
        try {
            const res = await fetch('/api/getCodeFavorite', {
                method: 'POST',
                body: JSON.stringify({ userID: userID }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
    
            if (res.status === 200) return data;
        } catch (err) {
            console.log(err);
        }
    }

    const getTags = async () => {
        try {
            const res = await fetch('/api/getTag', {
                method: 'POST',
                body: JSON.stringify(),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) {
                const box = document.getElementById('tags');
                let list = `<p class='blind'>대분류 선택</p>`;
                for (let e in data) {
                    const val = data[e];
                    list += `<a id='tag_${val.name}' href='/cheatSheet?tag=${val.name}' class=${(val.name === pageTag) ? 'on' : ''}>${val.title}</a>`;
                }
                box.innerHTML = list;
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        //유저가 아닐 경우 접근 막기
        if(!userNick || userNick === null) navigate('/');
        Promise.all([getTags(), getCode()]);
    }, [])

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div className='category text-center'>
                    <p className='blind'>카테고리 선택</p>
                    <a href='/mypage?tag=ALL'>favorite</a>
                    <a href='/cheatSheet?tag=JS' className='on'>cheat sheet</a>
                    <a href='/myCode?tag=ALL'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 cheat sheet</h2>
                    <div className='text-right mt-3 relative'>
                        <div id='tags' className='category'></div>
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