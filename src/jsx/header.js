import React from 'react';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';

//상단 레이아웃
/* 
main menu
1. 인증 코드
1. 즐겨찾기 코드(있다면)
2. 등록된 코드
3. 마이페이지
    내 코드 보기
    코드 작성
    자주 찾는 코드
4. 주인장

sub menu
1. 로그인
2. 회원가입

카테고리, 태그 분류 계정 정보에 저장돼야 함
*/
export default function Header() {
    const secureStorage = secureLocalStorage.default;
    const userNick = secureStorage.getItem('nick');
    const nowPage = window.location.pathname;
    let { on1, on2, on3, on4 } = '';
    const eventName = 'on';
    //각 페이지 메뉴 on이벤트
    switch (nowPage) {
        case '/' :
        case '/code' :
            on1 = eventName;
            break;
        case '/senior' :
        case '/senior/code' :
            on2 = eventName;
            break;
        case '/junior' :
        case '/junior/code' :
            on3 = eventName;
            break;
        default:
    }
    if (nowPage.match('mypage')) on4 = eventName;
    //console.log(nowPage);
    //console.log(secureStorage);

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
                        if(userNick) return <dd><a href='/mypage' className={on4}>mypage</a></dd>;
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
