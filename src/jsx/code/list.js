import React, { useState, useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import CodeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';

export default function CodeList() {
    let pageLev = window.location.pathname;
    const secureStorage = secureLocalStorage.default;
    const userID = secureStorage.getItem('id');
    const [sort, setSort] = useState('DESC');
    const [tag, setTag] = useState('*');
    const [search, setSearch] = useState('');
    let page = 0;
    let scrollTimer = 0;
    let lev = '';
    let codeTimer = 0;
    switch (pageLev) {
        case '/senior' :
            lev = 2;
            break;
        case '/junior' :
            lev = 1;
            break;
        default :
            lev = 0;
            pageLev = '';
    }

    useEffect(() => {
        getCodeList();
        
        window.onscroll = function (e) {
            if(scrollTimer === 0) {
                const topTarget = document.getElementById('scrollNextPage').getBoundingClientRect().top;
                
                if (topTarget < 1000) {
                    scrollTimer = 1;
                    page++;
                    getCodeList();
                }
            }
        }

    }, [])

    const getCodeList = async function () {
        if (page === null || !page) page = 0;
        if (codeTimer === 1) return;
        try {
            let codeBox = document.getElementById('code');
            const data = await submit();
            let result = '';

            //다음 데이터 없으면 멈춤
            if (!data.length) return;

            for (let e in data) {
                let { idx, title, desc, tag, context, date, userNick, editor } = data[e];
                if(!editor) editor = 'JS';
                if(search.length > 1) {
                    title = title.replace(search, '<i class="highlight">' + search + '</i>');
                    desc = title.replace(search, '<i class="highlight">' + search + '</i>');
                }

                result += '<li><a href="' + pageLev + '/code?idx=' + idx + '">'
                    + '<h4><i class="'+ tag +'">' + tag + '</i> ' + title + '</h4>'
                    + '<p class="date">' + date + ' | ' + userNick + '</p>'
                    + '<p class="desc">' + desc + '</p>'
                    + '<div class="codeBox"><div class="code ' + editor + '">' + CodeEditor(context)  + '</div></div>'
                    + '</a>'
                    + '</li>';
            }
            
            if (page === 0) codeBox.innerHTML = result;
            else if (page > 0) codeBox.innerHTML = codeBox.innerHTML + result;

            scrollTimer = 0;
            codeTimer = 0;
        } catch (err) {
            //console.log(err);
        }
    }

    const submit = async function () {
        //tag  sort
        try {
            if (search.length === 1) return alert('2글자 이상만 검색 가능합니다');

            codeTimer = 1;

            let codeBox = document.getElementById('code');

            const res = await fetch('/api/getCodeSearch', {
                method: 'POST',
                body: JSON.stringify({ tag: tag, sort: sort, search: search, page: page * 10, level: lev }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return data;
            if (res.status === 401 && ( search.length > 1 || tag !== '*')) codeBox.innerHTML = '<li class="noResult">' + data + '</li>';
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <React.StrictMode>
            <Header />
            <main>
                <form action='javascript:;' onSubmit={getCodeList}>
                <article className='searchGroup text-right overflow-hidden pr-2'>
                    <div className='category sort sm:float-right sm:ml-5 sm:pl-5 sm:border-l'>
                        <p className='blind'>정렬 선택</p>
                        <input type='radio' name='sort' id='sort_desc' defaultChecked value='DESC' onChange={() => {setSort('DESC')}} />
                        <label htmlFor='sort_desc'>최신</label>
                        <input type='radio' name='sort' id='sort_pop' value='pop' onChange={() => {setSort('pop')}} />
                        <label htmlFor='sort_pop'>인기</label>
                    </div>
                    <div className='category sm:float-right'>
                        <p className='blind'>대분류 선택</p>
                        <input type='radio' name='tag' id='tag_All' defaultChecked  value='*' onChange={() => {setTag('*');}} />
                        <label htmlFor='tag_All'>전체</label>
                        <input type='radio' name='tag' id='tag_JS' vlaue='JS' onChange={() => {setTag('JS');}} />
                        <label htmlFor='tag_JS' className='JS'>javascript</label>
                        <input type='radio' name='tag' id='tag_git' vlaue='git' onChange={() => {setTag('git');}} />
                        <label htmlFor='tag_git' className='git'>git</label>
                        <input type='radio' name='tag' id='tag_linux' vlaue='linux' onChange={() => {setTag('linux');}} />
                        <label htmlFor='tag_linux' className='linux'>linux</label>
                        <input type='radio' name='tag' id='tag_mysql' value='mysql' onChange={() => {setTag('mysql')}} />
                        <label htmlFor='tag_mysql'>mysql</label>
                        <input type='radio' name='tag' id='tag_FE' vlaue='FE' onChange={() => {setTag('FE');}} />
                        <label htmlFor='tag_FE' className='FE'>frontend</label>
                        <input type='radio' name='tag' id='tag_BE' vlaue='BE' onChange={() => {setTag('BE');}} />
                        <label htmlFor='tag_BE' className='BE'>backend</label>
                    </div>
                    <div className='searchBox float-right w-full mt-0 mb-5 sm:mt-5'>
                        <p className='blind'>검색 하기</p>
                        <div className='relative pr-14'>
                            <input className='input' type='text' placeholder='검색어 입력' value={search} onChange={(e) => setSearch(e.target.value)} />
                            <input type='submit' value='검색' className='btn w-18 absolute top-0 right-0' />  
                        </div>
                    </div>
                </article> 
                </form>
                <ul className='codeList' id='code'></ul>
                <p id='scrollNextPage'><span className='blind'>다음 목록 불러오기</span></p>
            </main>
            <Footer />
        </React.StrictMode>
    );
}