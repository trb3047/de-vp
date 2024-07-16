import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
//import codeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageMyCode() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    //const userLevel = secureStorage.getItem('level');
    const pageTag = new URL(window.location.href).searchParams.get('tag');

    async function getCode() {
        const box = document.getElementById('codeList');
        const data = await getCodeList();
        let code = '';
        for (let e in data) {
            const { idx, title, desc, tag, date, recomand, tagColor } = data[e];
            if(tag === pageTag || pageTag === 'ALL') {
                code += '<li><a href="/mypage/myCodeEdit?idx=' + idx + '">'
                        +    `<h4><i class='icon' style='background-color:${tagColor}'>${tag}</i> ${title}</h4>`
                        +    '<p class="date">' + date + ' | 즐겨찾기: ' + recomand + '</p>'
                        +    '<p class="desc">' + desc + '</p>'
                        //+    "<div id='code" + Number(e + 1) + "' class='code javascript'>" + CodeEditor(codeData.context) + "</div>"
                        + "</a></li>";
            }
        }

        box.innerHTML = (code === '') ? '<li class="noResult">아직 작성한 code가 없습니다</li>' : code;
        
    }
    
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

    const getTags = async () => {
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
                    +  `<a href='/mypage/myCode?tag=ALL' class=${(pageTag === 'ALL') ? 'on' : ''}>전체</a>`;
            for (let e in data) {
                const val = data[e];
                list += `<a id='tag_${val.name}' href='/mypage/myCode?tag=${val.name}' class=${(val.name === pageTag) ? 'on' : ''}>${val.title}</a>`;
            }
            box.innerHTML = list;
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
                    <a href='/mypage/cheatSheet?tag=JS'>cheat sheet</a>
                    <a href='/mypage/myCode?tag=ALL' className='on'>my code</a>
                </div>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 code</h2>
                    <div className='text-right mt-3'>
                        <div id='tags' className='category'></div>
                        <ul id='codeList' className="codeList mt-3 text-left"></ul>
                    </div>
                    <p id='scrollNextPage'><span className='blind'>다음 목록 불러오기</span></p>
                    <div className='btnGroup text-center mt-3'>
                        <a href='/mypage/myCodeAdd' className='btn apply'>code 작성</a>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}