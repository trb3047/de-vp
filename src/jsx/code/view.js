import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import codeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';
import Comment from './comment.js';

export default function CodeView() {
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const idx = new URL(window.location.href).searchParams.get('idx');

    useEffect(() => {
        getCode();
    }, [])

    async function getCode() {
        const tit = document.getElementById('title');
        const codeBox = document.getElementById('codeBox');
        const nick = document.getElementById('nick');
        const desc = document.getElementById('desc');
        const btn = document.getElementById('btn');
        const data = await getCodeView();
        let favorCadeData = await getFavorCode();

        tit.innerHTML = data.title;
        nick.innerHTML = `${data.date} | ${data.userNick}`;
        desc.innerHTML = data.desc;
        if(!data.editor) data.editor = 'JS';
        codeBox.innerHTML = '<div class="code ' + data.editor + '">' + codeEditor(data.context) + '</div>';
        
        btn.innerHTML = `<button class='btn' id='btnList'>목록</button>`;
        if (userNick === data.userNick) btn.innerHTML = btn.innerHTML + '<a href="/mypage/myCodeEdit?idx=' + idx + '" class="btn apply">수정</a>'; 
        if (userNick) btn.innerHTML = btn.innerHTML + `<button class='addFavor ${
            favorCadeData.split(',').map((val) => {
                return (val === idx) ? 'on' : ''; 
            }).join('')}' data-idx="${idx}"><span class='blind'>즐겨찾기 추가</span></button>`;
        
        let btnList = document.getElementById('btnList');
        btnList.onclick = function () {
            navigate(-1);
        }

        //즐겨찾기 등록
        if (userNick) {
            document.querySelector('.addFavor').onclick = async function (e) {
                if (e.target.className.match('on')) return deleteFavorCode();

                const res1 = await fetch('/api/upRecomand', {
                    method: 'POST',
                    body: JSON.stringify({ idx: idx }),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res1.status === 200) {
                    const res2 = await fetch('/api/addFavorCode', {
                        method: 'POST',
                        body: JSON.stringify({ userID: userID, favorCode: idx }),
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    });
            
                    let data = await res2.json();

                    if (res2.status === 200) {
                        alert(data);
                        getCode();
                    }
                }
            };
        }
    }

    async function getCodeView() {
    
        const res = await fetch('/api/getCodeView', {
            method: 'POST',
            body: JSON.stringify({ idx: idx }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        
        return data;
    }

    const getFavorCode = async function () {
        try {
            const res = await fetch('/api/getFavorCode', {
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

    const deleteFavorCode = async function () {
        try {
            let favorCadeData = await getFavorCode();
            let favorCode = [];
            favorCadeData.split(',').map((val) => {
                if (val !== idx) favorCode.push(val); 
            });

            const res1 = await fetch('/api/downRecomand', {
                method: 'POST',
                body: JSON.stringify({ idx: idx }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if(res1.status === 200) {
                const res2 = await fetch('/api/deleteFavorCode', {
                    method: 'POST',
                    body: JSON.stringify({ userID: userID, favorCode: favorCode.join(',') }),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
        
                let data = await res2.json();
    
                if (res2.status === 200) {
                    alert(data);
                    getCode();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <React.StrictMode>
            <Header />
            <main>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center" id='title'></h2>
                    <p id='nick' className='text-sm text-gray-500 text-right'></p>
                    <p id='desc' className='mt-2 mb-2 bg-gray-100 p-2'></p>
                    <article id='codeBox' className="codeBox mt-2 pl-2 pr-2 sm:pl-0 sm:pr-0">
                    </article>
                    <div className='btnGroup overflow-hidden text-center mt-3' id='btn'></div>
                    <Comment />
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}