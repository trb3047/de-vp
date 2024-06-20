import React, { useEffect } from 'react';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import codeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';

export default function CodeView() {
    const secureStorage = secureLocalStorage.default;
    const idx = new URL(window.location.href).searchParams.get('idx');
    const userNick = secureStorage.getItem('nick');

    useEffect(() => {
        async function getCode() {
            const tit = document.getElementById('title');
            const codeBox = document.getElementById('codeBox');
            const desc = document.getElementById('desc');
            const btn = document.getElementById('btn');
            const data = await getCodeView();

            tit.innerHTML = data.title;
            desc.innerHTML = data.desc;
            codeBox.innerHTML = '<div class="code ' + data.editor + '">' + codeEditor(data.context) + '</div>';
            
            if(userNick === data.userNick) btn.innerHTML = '<a href="/mypage/myCodeEdit?idx=' + idx + '" class="btn apply">수정</a>'; 
            
        }
        getCode();
    }, [])

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
                    <p id='desc' className='mt-2 mb-2 bg-gray-100 p-2'></p>
                    <article id='codeBox' className="codeBox mt-2 pl-2 pr-2 sm:pl-0 sm:pr-0">
                    </article>
                    <div className='btnGroup text-right mt-5' id='btn'></div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}