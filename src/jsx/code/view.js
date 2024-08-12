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
    const userAdmin = secureStorage.getItem('ad');
    const adChk = userAdmin === 1 && userNick === '블랙라임';
    const idx = new URL(window.location.href).searchParams.get('idx');

    async function getCode() {
        const tit = document.getElementById('title');
        const codeBox = document.getElementById('codeBox');
        const nick = document.getElementById('nick');
        const desc = document.getElementById('desc');
        const btn = document.getElementById('btn');
        let chkTimer = 0;
        const data = await getCodeView();
        let favorCadeData = await getFavorCode();

        if (data.private === 'AN' && !adChk) {
            alert('비공개 처리 된 code 입니다');
            navigate('/');
            return;
        }
        tit.innerHTML = data.title;
        nick.innerHTML = `${data.date} | ${data.userNick}`;
        desc.innerHTML = data.desc;
        if(!data.editor) data.editor = 'JS';
        codeBox.innerHTML = '<div class="code ' + data.editor + '">' + codeEditor(data.context) + '</div>';
        
        btn.innerHTML = `<button class='btn' id='btnList'>목록</button>`;
        if (userNick === data.userNick) btn.innerHTML = btn.innerHTML + '<a href="/myCodeEdit?idx=' + idx + '" class="btn apply">수정</a>'; 
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
                if (chkTimer === 1) return;
                if (e.target.className.match('on')) return deleteFavorCode();
                chkTimer = 1;
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
                    body: JSON.stringify({ userID: userID, favorCode: favorCode.length === 0 ? ',' : favorCode.join(',') }),
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
    
    useEffect(() => {
        getCode();
    }, [])

    return (
        <>
            <Header />
            <main>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center break-keep" id='title'></h2>
                    <p id='nick' className='mt-1 text-sm text-gray-500 text-right p-2'></p>
                    <p id='desc' className='mt-2 bg-gray-100 p-2'></p>
                    <article id='codeBox' className="codeBox">
                    </article>
                    <div className='btnGroup overflow-hidden text-center mt-3' id='btn'></div>
                    <Comment />
                </div>
            </main>
            <Footer />
        </>
    );
}