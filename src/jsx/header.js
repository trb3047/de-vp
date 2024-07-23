import React, { useEffect } from 'react';
// import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';

//상단 레이아웃
export default function Header() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const userAdmin = secureStorage.getItem('ad');
    const nowPage = window.location.pathname;
    const codePage = new URL(window.location.href).searchParams.get('page');
    let { on1, on2, on3, on4, on5 } = '';
    const eventName = 'on';
    let timer;
    //각 페이지 메뉴 on이벤트
    switch (nowPage) {
        case '/' :
        case '/code' :
            on1 = eventName;
            break;
        case '/senior' :
        case '/seniorCode' :
            on2 = eventName;
            break;
        case '/junior' :
        case '/juniorCode' :
            on3 = eventName;
            break;
        case '/mypage' :
        case '/cheatSheet' :
        case '/myCode' :
        case '/myCodeAdd' :
        case '/myCodeEdit' :
                on4 = eventName;
                break;
        case '/@admin' :
            on5 = eventName;
            break;
        default:
            if (codePage === 'senior') on2 = eventName;
            if (codePage === 'junior') on3 = eventName;
    }

    //차단된 ID 로그아웃 처리 / 현재 서비스 환경이 사양이 너무 낮아서 새로고침 할 때나 작동하게끔 처리
    // const goOut = useCallback(async () => { 
    const goOut = async () => {
        try {
            const res = await fetch('/api/goOut', {
                method: 'POST',
                body: JSON.stringify({ userID: userID }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            let data = await res.json();
            //console.log(data);
            if (res.status === 200) navigate('/logout');
        } catch (err) {
            console.log(err);
        }
    }
    // }, [])

    useEffect(() => {
        if (userNick) {
            if(timer) return;
            timer = setTimeout(() => {
                goOut();
            }, 500);
        }
    }, [])
    // }, [userNick, timer, goOut])

    return (
        <header className='pt-10 shadow-md relative'>
            <div className='text-center'>
                <h1 className='text-3xl font-bold'><a href='/'>DE-VP</a></h1>
                <p className='text-sm mt-2'>deep information for developer</p>
            </div>
            <nav className='mt-8 border-t'>
                <dl className='gnb flex justify-center'>
                    <dt className='blind'>메인 메뉴</dt>
                    <dd><a href='/' className={on1}>total</a></dd>
                    <dd><a href='/senior' className={on2}>senior</a></dd>
                    <dd><a href='/junior' className={on3}>junior</a></dd>
                    {(() => {
                        if(userNick) return <dd><a href='/mypage?tag=ALL' className={on4}>mypage</a></dd>;
                    })()}
                    {(() => {
                       if(userAdmin) return <dd><a href='/@admin' className={on5}>admin</a></dd>;
                    })()}
                </dl>
                <dl className='snb absolute top-1 right-2 flex justify-end'>
                    <dt className='blind'>서브 메뉴</dt>
                    {(() => {
                        if(userNick) return <dd><a href='/logout'>로그아웃</a></dd>;
                        else {
                            return (
                                <React.StrictMode>
                                <dd><a href='/login'>로그인</a></dd>
                                <dd><a href='/join'>회원가입</a></dd>
                                </React.StrictMode>
                            )
                        }
                    })()}
                    <dd><a href='/contact'>Contact</a></dd>
                </dl>
            </nav>
        </header>
    );
}
