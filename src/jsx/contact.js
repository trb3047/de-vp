import React from 'react';
import Header from './header.js';
import Footer from './footer.js';

export default function PageInfo() {
    return (    
        <>
            <Header />
            <main>
                <h2 className="text-xl text-center">Contact</h2>
                <div className="text-left mt-5 pl-5 pr-5 max-w-screen-md md:ml-auto md:mr-auto md:pl-0 md:pr-0">
                    <ul>
                        <li className="overflow-hidden">
                            <p className="float-left w-2/12">이름</p>
                            <p className="float-left w-10/12">최성훈</p>
                        </li>
                        <li className="overflow-hidden mt-3">
                            <p className="float-left w-2/12">e-mail</p>
                            <p className="float-left w-10/12">hoon_1215@naver.com</p>
                        </li>
                        <li className="overflow-hidden mt-3">
                            <p className="float-left w-2/12">GitHub</p>
                            <p className="float-left w-10/12"><a href="https://github.com/trb3047/" target="_blank" className="btn apply" rel="noopener noreferrer">바로가기</a></p>
                        </li>
                        <li className="mt-3 overflow-hidden pt-2 border-t border-t-white">
                            <p className="float-left w-2/12">이력</p>
                            <ul className="float-left w-10/12">
                                <li>24.05~24.10<br />새싹&#40;SeSAC&#41; 전성호 선생님 &#40;영등포6기&#41; 풀스택 프로젝트 실무과정 진행중</li>
                                <li className="mt-3">23.10~24.01<br />에스알테크 / 개인사업자 / 스마트 스토어 노트북 판매 사업</li>
                                <li className="mt-3">22.12~23.09<br />자라리테일코리아&#40;주&#41; / OP&#40;계약직&#41; / 스토어 상품 및 창고 관리</li>
                                <li className="mt-3">21.09~22.08<br />쿠팡풀필먼트서비스 / 출고팀 캡틴 / 계약직 PS 사원부터 시작해 팀 캡틴까지&#40;물류 상황에 맞게 인력 관리&#41;</li>
                                <li className="mt-3">21.03~21.09<br />쿠팡풀필먼트서비스 / 일용직</li>
                                <li className="mt-3">17.10~19.01<br />&#40;주&#41;제이넷 / 사원 / 공공도서관 웹 퍼블리싱 및 디자인 관련 js개발&#40;웹앱, 키오스크 등&#41;, 웹접근성 마크 다수 획득</li>
                                <li className="mt-3">16.10~17.09<br />이노웹&#40;주&#41; / 사원 / 웹에이전시 웹 퍼블리셔</li>
                                <li className="mt-3">16.03~16.07<br />서울현대실용전문학교 반응형 웹디자인 전문가 과정 수료</li>
                            </ul>  
                        </li>
                        <li className="overflow-hidden mt-3 pt-2 border-t border-t-white">
                            <p className="float-left w-2/12">학력</p>
                            <ul className="float-left w-10/12">
                                <li>12.03~21.06<br />숭실대학교 음악원 4학년 중퇴 / 관현악과&#40;트럼본&#41; 전공</li>
                                <li className="mt-3">09.03~12.02<br />호평고등학교 졸업</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </main>
            <Footer />
        </>
    );
}