import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';
import CodeEditor from '../../js/editor.js';

export default function PageMypage() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const pageTag = new URL(window.location.href).searchParams.get('tag');

    async function getCode() {
        try {
            const box = document.getElementById('codeList');
            const data = await getCodeList();
            let code = '';
            for (let e in data) {
                let { idx, title, desc, tag, date, userNick, editor, context, tagColor } = data[e];
                if (!editor) editor = 'JS';
                if (tag === pageTag || pageTag === 'ALL') {
                    code += `<li>`
                            +    '<a href="/code?idx=' + idx + '">'
                            +    `<h4><i class='icon' style='background-color:${tagColor}'>${tag}</i> ${title}</h4>`
                            +    '<p class="date">' + date + ' | ' + userNick + '</p>'
                            +    '<p class="desc">' + desc + '</p>'
                            +    "<div class='codeBox'><div class='code " + editor + "'>" + CodeEditor(context) + "</div></div>"
                            + "</a></li>";
                    
                }
            }
            box.innerHTML = (code === '') ? '<li class="noResult">아직 즐겨찾기한 code가 없습니다</li>' : code;
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
                let list = `<p class='blind'>대분류 선택</p>`
                        +  `<a href='/mypage?tag=ALL' class=${(pageTag === 'ALL') ? 'on' : ''}>전체</a>`;
                for (let e in data) {
                    const val = data[e];
                    list += `<a id='tag_${val.name}' href='/mypage?tag=${val.name}' class=${(val.name === pageTag) ? 'on' : ''}>${val.title}</a>`;
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
                    <a href='/mypage?tag=ALL' className='on'>favorite</a>
                    <a href='/cheatSheet?tag=JS'>cheat sheet</a>
                    <a href='/myCode?tag=ALL'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 favorite code</h2>
                    <div className='text-right mt-3'>
                        <div id='tags' className='category'></div>
                        <ul id='codeList' className="codeList mt-3 text-left"></ul>
                    </div>
                    <p id='scrollNextPage'><span className='blind'>다음 목록 불러오기</span></p>
                    <div className='btnGroup text-center mt-3'>
                        <a href='/' className='btn apply'>찾으러 가기</a>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}