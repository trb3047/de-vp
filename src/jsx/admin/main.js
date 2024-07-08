import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        //관리자 외엔 튕구기
        if(!adChk) navigate('/');
        getUsers();
    }, [])

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
            const res = await fetch('/api/levelUp', {
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
        + `<ul class=''>`;
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
            + `<button class='btn apply float-left' id='btnNotBlock'>차단 해제</button>`
            + `<button class='btn join float-left' id='btnLevUp'>시니어 등록</button>`
            + `<button class='btn float-right' id='btnPrivateN'>비공개</button>`
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

        document.getElementById('btnLevUp').onclick = function () {
            levUpUser();
        }

        document.getElementById('btnPrivateY').onclick = function () {
            privateY();
        }
        
        document.getElementById('btnPrivateN').onclick = function () {
            privateN();
        }
    }

    return (
        <React.StrictMode>
            <Header />
            <main onLoad={getUsers}>
                <dl className='text-center'>
                    <dt className='blind'>관리자 메뉴</dt>
                    <dd className='inline-block'><button className='btn apply text-sm' onClick={getUsers}>이용자</button></dd>
                    <dd className='inline-block ml-3'><button className='btn apply text-sm' onClick={getCodes}>code</button></dd>
                    <dd className='inline-block ml-3'><button className='btn apply text-sm' onClick={getComments}>댓글</button></dd>
                </dl>
                <div className='' id='list'>

                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}