import React, { useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageFindIdResult() {
    const secureStorage = secureLocalStorage.default;
    const getID = secureStorage.getItem('userID');

    //보여준 이후 정보 삭제
    useEffect(() => {
        secureStorage.clear();
    }, [])

    return (    
        <>
            <Header />
            <main>
                <div className="loginBox max-w-screen-sm ml-auto mr-auto text-center">
                    <h2 className="text-xl">ID 찾기</h2>
                    <div className='pt-10 pb-10'>
                        이용자님의 ID는 <b className='text-xl font-bold text-green-500'>{getID}</b>입니다.
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}