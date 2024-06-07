import React from 'react';

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
export default class Header extends React.Component {
    render() {
        return (
            <React.StrictMode>
            <header className='pt-10 shadow-md relative'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold'><a href='./'>DE-VP</a></h1>
                    <p className='text-sm mt-2'>deep information for developer</p>
                </div>
                <nav className='mt-8 border-t'>
                    <dl className='gnb flex justify-center'>
                        <dt className='blind'>메인 메뉴</dt>
                        <dd><a href='#'>인증 Code</a></dd>
                        <dd><a href='#'>Code</a></dd>
                    </dl>
                    <dl className='snb absolute top-1 right-2 flex justify-end'>
                        <dt className='blind'>서브 메뉴</dt>
                        <dd><a href='/login'>로그인</a></dd>
                        <dd><a href='/join'>회원가입</a></dd>
                        <dd><a href='/contact'>Contact</a></dd>
                    </dl>
                </nav>
            </header>
            </React.StrictMode>
        );
    }
  
  }
