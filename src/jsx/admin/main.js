import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageAdmin () {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userAdmin = secureStorage.getItem('ad');
    const userNick = secureStorage.getItem('nick');
    const adChk = userAdmin === 1 && userNick === '블랙라임';
    let page = 'user';

    const getUsers = async () => {
        const res = await fetch('/api/getUsers', {
            method: 'POST',
            body: JSON.stringify(),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        //console.log(data);
        if (res.status === 200) {
            page = 'user';
            print(data);
        }
    }

    const getCodes = async () => {
        const res = await fetch('/api/getCodes', {
            method: 'POST',
            body: JSON.stringify(),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        //console.log(data);
        if (res.status === 200) {
            page = 'code';
            print(data);
        }
    }

    const getComments = async () => {
        const res = await fetch('/api/getComments', {
            method: 'POST',
            body: JSON.stringify(),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        //console.log(data);
        if (res.status === 200) {
            page = 'comment';
            print(data);
        }
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
            page = 'tag';
            const box = document.getElementById('list');
            let list = ``;
            list += `<div class='mt-3 pl-2 pr-2 sm:pl-0 sm:pr-0 sm:float-left sm:w-2/4'>`;
            for (let e in data) {
                if (e == 0) {
                    list += `<i style='background-color:${data[e].color}' class='icon'>${data[e].name}</i>`
                } else {
                   list += `<i style='background-color:${data[e].color}' class='ml-2 icon'>${data[e].name}</i>`
                }
            }
            list += `</div>`;

            list += `<div class='mt-3 pl-2 pr-2 sm:pl-0 sm:pr-0 sm:float-left sm:w-2/4'>`
                + `<form action='javascript:;' id='addTagForm' class='block sm:ml-2'>`
                + `<label class='block'>`
                +   `<h4 class='mb-2'>제목</h4>`
                +   `<input type='text' id='tit' class='input w-full' placeholder='대분류 제목으로 사용됩니다'>`
                + `</label>`
                + `<label class='block mt-2'>`
                +   `<h4 class='mb-2'>아이콘 이름</h4>`
                +   `<input type='text' id='name' class='input w-full' placeholder='아이콘으로 사용됩니다'>`
                + `</label>`
                + `<label class='block mt-2'>`
                +   `<h4 class='mb-2'>아이콘 색상</h4>`
                +   `<input type='text' id='color' class='input w-full' placeholder='아이콘의 배경색으로 사용됩니다 ex) #8b5cf6, rgb(0, 0, 0)'>`
                + `</label>`
                + `<div class='mt-3 text-right'>`
                +   `<input type='submit' value='추가하기' class='btn join'>`
                + `</div>`
                + `</form>`
                + `</div>`;

            box.innerHTML = list;

            document.getElementById('addTagForm').onsubmit = function (e) {
                e.preventDefault();
                const title = document.getElementById('tit').value;
                const name = document.getElementById('name').value;
                const color = document.getElementById('color').value;
                addTags(title, name, color);
            }

        }
    }
    const addTags = async (title, name, color) => {
        try {
            const res = await fetch('/api/addTag', {
                method: 'POST',
                body: JSON.stringify({ title: title, name: name, color: color }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) {
                alert(data);
                getTags();
            }
        } catch (err) {
            console.log(err);
        }
    }

    //유저 차단
    const blockUsers = async () => {
        const reqData = selectData();
        try {
            const res = await fetch('/api/blockUsers', {
                method: 'POST',
                body: JSON.stringify(reqData),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return rePrint(data);
        } catch (err) {
            console.log(err);
        }
    }
    //차단 해제
    const notBlockUsers = async () => {
        const reqData = selectData();
        try {
            const res = await fetch('/api/notBlockUsers', {
                method: 'POST',
                body: JSON.stringify(reqData),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return rePrint(data);
        } catch (err) {
            console.log(err);
        }
    }
    //시니어 등업
    const levUpUser = async () => {
        const reqData = selectData();
        try {
            const res = await fetch('/api/'+ page +'LevelUp', {
                method: 'POST',
                body: JSON.stringify(reqData),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return rePrint(data);

        } catch (err) {

        }
    }
    //공개/비공개
    const privateY = async () => {
        const reqData = selectData();
        if (page === 'user') return alert('code와 댓글만 처리 가능합니다');
        try {
            const res = await fetch('/api/' + page + 'PrivateY', {
                method: 'POST',
                body: JSON.stringify(reqData),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return rePrint(data);

        } catch (err) {

        }
    }
    const privateN = async () => {
        const reqData = selectData();
        if (page === 'user') return alert('code와 댓글만 처리 가능합니다');
        try {
            const res = await fetch('/api/' + page + 'PrivateN', {
                method: 'POST',
                body: JSON.stringify(reqData),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
    
            let data = await res.json();
            //console.log(data);
            if (res.status === 200) return rePrint(data);

        } catch (err) {

        }
    }

    const selectData = () => {
        const chkbox = document.querySelectorAll(`input[name='idx']:checked`);
        const reqData = [];
        for (let i = 0; i < chkbox.length; i += 1) {
            reqData.push(chkbox[i].value);
        }
        return reqData;
    }

    const rePrint = (data) => {
        alert(data);
        switch (page) {
            case 'code' :
                getCodes();
                break;
            case 'comment' :
                getComments();
                break;
            case 'user' :
                getUsers();
                break;
            default :
        }
    }

    const print = (data) => {
        let list = `<p class='pt-2 pb-2'><label><input type='checkbox' id='chkAll'> 전체 선택</label></p>`
        + `<ul>`;
        data.map((val) => {
            list += `<li class='flex justify-between pt-2 pb-2 border-t border-gray-300'>`;
            //console.log(val);
            for (let e in val) {
                const value = val[e];
                if (e == 'recomand' || e == 'tag') {
                    list += `<p>${value}</p>`;
                } else if (e === 'userID') {
                    list += `<p class='userID w-40'>${value}</p>`;
                } else if (e === 'userNick') {
                    list += `<p class='w-40'>${value}</p>`;
                } else if (e === 'userEmail') {
                    list += `<p class='w-80'>${value}</p>`;
                } else if (e === 'idx') {
                    list += `<p class=''><input type='checkbox' name='idx' value='${(val.commentID >= 0) ? val.idx : val.codeID ?? value}'></p>`;
                } else if (e === 'title' || (e === 'context' && val.codeID)) { 
                    list += `<a class='block overflow-hidden w-80 text-ellipsis text-nowrap text-sky-400 hover:underline' href='/code?idx=${(val.codeID) ? val.codeID : val.idx}' target='_blank'>${value}</a>`;
                } else if (e == 'private') {
                    list +=  `<p>${(value === 'Y') ? '공개' : '비공개'}</p>`;
                } else if (e == 'level') {
                    list += `<p>${(value === 1) ? '주니어' : (value !== 0) ? '시니어': '<span class="bg-gray-400">차단</span>'}</p>`;
                }
            };
            list += `</li>`;
        })
        list += `</ul>`
            + `<div class='overflow-hidden text-right mt-2'>`
            + `<button class='btn delete float-left' id='btnBlock'>유저 차단</button>`
            + `<button class='btn apply float-left' id='btnNotBlock'>차단 해제</button>`;
        list += (page !== 'comment') ? `<button class='btn join float-left' id='btnLevUp'>시니어 등록</button>` : ``;
        list +=  `<button class='btn float-right' id='btnPrivateN'>비공개</button>`
            + `<button class='btn float-right' id='btnPrivateY'>공개</button>`
            + `</div>`;


        document.getElementById('list').innerHTML = list;

        //전체 선택
        document.getElementById('chkAll').onclick = function (e) {
            const chkbox = document.querySelectorAll(`input[name='idx']`);
            const chk = e.target.checked;
            for (let i = 0; i < chkbox.length; i += 1) chkbox[i].checked = chk;
        }

        document.getElementById('btnBlock').onclick = function () {
            blockUsers();
        }

        document.getElementById('btnNotBlock').onclick = function () {
            notBlockUsers();
        }
        if (page !== 'comment') {
            document.getElementById('btnLevUp').onclick = function () {
                levUpUser();
            }
        }

        document.getElementById('btnPrivateY').onclick = function () {
            privateY();
        }
        
        document.getElementById('btnPrivateN').onclick = function () {
            privateN();
        }
    }

    useEffect(() => {
        //관리자 외엔 튕구기
        if(!adChk) navigate('/');
        getUsers();
    }, [])

    return (
        <React.StrictMode>
            <Header />
            <main onLoad={getUsers}>
                <dl className='text-center'>
                    <dt className='blind'>관리자 메뉴</dt>
                    <dd className='inline-block'><button className='btn apply text-sm' onClick={getUsers}>이용자</button></dd>
                    <dd className='inline-block ml-3'><button className='btn apply text-sm' onClick={getCodes}>code</button></dd>
                    <dd className='inline-block ml-3'><button className='btn apply text-sm' onClick={getComments}>댓글</button></dd>
                    <dd className='inline-block ml-3'><button className='btn apply text-sm' onClick={getTags}>카테고리</button></dd>
                </dl>
                <div id='list' className='overflow-hidden'>

                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}