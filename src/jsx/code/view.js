import React, { useEffect, useState } from 'react';
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
    const [comment, setComment] = useState('');
    const [commentID, setCommentID] = useState(0);

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

        tit.innerHTML = data.title;
        nick.innerHTML = `${data.date} | ${data.userNick}`;
        desc.innerHTML = data.desc;
        if(!data.editor) data.editor = 'JS';
        codeBox.innerHTML = '<div class="code ' + data.editor + '">' + codeEditor(data.context) + '</div>';
        
        btn.innerHTML = `<button class='btn' id='btnList'>목록</button>`;
        if(userNick === data.userNick) btn.innerHTML = btn.innerHTML + '<a href="/mypage/myCodeEdit?idx=' + idx + '" class="btn apply">수정</a>'; 
        
        let btnList = document.getElementById('btnList');
        btnList.onclick = function () {
            navigate(-1);
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


    return (
        <React.StrictMode>
            <Header />
            <main>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center" id='title'>code</h2>
                    <p id='nick' className='text-sm text-gray-500'></p>
                    <p id='desc' className='mt-2 mb-2 bg-gray-100 p-2'></p>
                    <article id='codeBox' className="codeBox mt-2 pl-2 pr-2 sm:pl-0 sm:pr-0">
                    </article>
                    <div className='btnGroup text-center mt-3' id='btn'></div>
                    <Comment />
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}