import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';
import codeEditor from '../../js/editor.js';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageMyCodeAdd() {
    const navigate = useNavigate();
    const secureStorage = secureLocalStorage.default;
    const idx = new URL(window.location.href).searchParams.get('idx');
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const [tit, setTit] = useState('');
    const [desc, setDesc] = useState('');
    const [code, setCode] = useState('');
    const [tag, setTag] = useState('JS');
    const [tagColor, setTagColor] = useState('');
    const [privat, setPrivate] = useState('Y');
    const [useEditor, setUseEditor] = useState('JS');

    async function getCode() {
        const codeBox = document.getElementById('code');
        const data = await getCodeView();
        let { title: dataTitle, desc: dataDesc, context: dataContext, userID: dataID, tag: dataTag, private: dataPrivate, editor: dataUseEditor, tagColor: dataTagColor } = data;
        //자신의 코드가 아닐 경우 리다이렉트
        if(userID !== dataID) navigate('/');
        
        setTit(dataTitle);
        setDesc(dataDesc);
        setCode(dataContext);
        setTag(dataTag);
        setTagColor(dataUseEditor);
        setPrivate(dataPrivate);
        if (!dataUseEditor) dataUseEditor = 'JS'; 
        setUseEditor(dataTagColor);

        document.getElementById('tag_' + dataTag).checked = true;
        document.getElementById('private_' + dataPrivate).checked = true;
        document.getElementById('lang_' + dataUseEditor).checked = true;
        codeBox.innerHTML = codeEditor(dataContext);
    }    
    
    //에디터 관련
    const compiler = function (id) {
        const codeBox = document.getElementById(id);
        codeBox.innerHTML = codeEditor(code);
    }

    const key = function (obj) {
        const keyCode = obj.keyCode;
        //탭
        if (keyCode === 9) {
            setCode(code + '    ');
            obj.preventDefault();
        }
    }

    const submit = async function () {
        if (!tit) return alert('제목을 입력해 주세요');
        if (!code) return alert('code를 작성해 주세요');

        try {
            const today = new Date();
            const thisDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
            const res = await fetch('/api/codeEdit', {
                method: 'POST',
                body: JSON.stringify({ idx: idx, title: tit, desc: desc, context: code, tag: tag, private: privat, date: thisDate, editor: useEditor, tagColor: tagColor }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.status === 200) {
                alert(data);
                navigate('/code?idx=' + idx);
            }
            if (res.status === 500) console.log(data);
        } 
        catch(err) {
            console.log(err);
        }
    }

    const getCodeView = async function () {
        
        const res = await fetch('/api/getCodeView', {
            method: 'POST',
            body: JSON.stringify({ idx: idx }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        
        return data;
    }

    const deleteCode =  async function () {
        const res = await fetch('/api/codeDelete', {
            method: 'POST',
            body: JSON.stringify({ idx: idx }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        
        if(res.status === 200) {
            alert(data);
            navigate('/mypage/myCode');
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
            const box = document.getElementById('tags');
            let list = `<p class='blind'>분류 선택</p>`;
            for (let e in data) {
                const val = data[e];
                if (e == 0) {
                    setTag(val.name);
                    list += `<input type='radio' name='tag' id='tag_${val.name}' checked value='${val.name}' data-color='${val.color}'>`
                } else {
                    list += `<input type='radio' name='tag' id='tag_${val.name}' value='${val.name}' data-color='${val.color}'>`
                }
                list += `<label for='tag_${val.name}'>${val.title}</label>`;
            }
            box.innerHTML = list;

            const tagList = document.querySelectorAll('input[name="tag"]');
            for (let i = 0; i < tagList.length; i += 1) {
                const val = tagList[i];
                val.onchange = function () {
                    setTag(val.value);
                    setTagColor(val.getAttribute('data-color'));
                }
            }
        }
    }

    useEffect(() => {
        //유저가 아닐 경우 접근 막기
        if (!userNick || userNick === null) navigate('/');
        Promise.all([getTags(), getCode()]);
    }, [userNick, navigate, getTags, getCode])

    return (    
        <React.StrictMode>
            <Header />
            <main>
                <div id='cont' className='mt-5'>
                    <h2 className="text-xl text-center">{userNick}의 code</h2>
                    <ul className="mt-5">
                        <li className='pl-2 pr-2'>
                            <label htmlFor="title" className='block w-full'>제목</label>
                            <input type="text" id="title" placeholder="큰 주제를 입력해 주세요" className="input w-full mt-2" value={tit} onChange={(e) => setTit(e.target.value)} />
                        </li>
                        <li className='pl-2 pr-2 mt-2'>
                            <label htmlFor="desc" className='block w-full'>설명</label>
                            <input type="text" id="desc" placeholder="부가 설명이 필요하다면 입력해 주세요" className="input w-full mt-2" value={desc} onChange={(e) => setDesc(e.target.value)} />
                        </li>
                    </ul>
                    <article className='searchGroup text-right overflow-hidden mt-5'>
                       <div className='category sort sm:float-right sm:ml-5 sm:pl-5 sm:border-l'>
                            <p className='blind'>공개 선택</p>
                            <input type='radio' name='private' id='private_Y' value='Y' onChange={() => {setPrivate('Y')}} />
                            <label htmlFor='private_Y'>공개</label>
                            <input type='radio' name='private' id='private_N' value='N' onChange={() => {setPrivate('N')}} />
                            <label htmlFor='private_N'>비공개</label>
                        </div>
                       <div id='tags' className='category mt-3 sm:mt-0 sm:float-right sm:ml-5 sm:pl-5 sm:border-l'>
                            
                        </div>
                        <div className='category sort mt-3 sm:mt-0 sm:float-right sm:text-right'>
                            <p className='blind'>언어 선택</p>
                            <input type='radio' name='lang' id='lang_JS' value='JS' onChange={() => setUseEditor('JS')} />
                            <label htmlFor='lang_JS'>javascript</label>
                            <input type='radio' name='lang' id='lang_default' value='default' onChange={() => setUseEditor('default')} />
                            <label htmlFor='lang_default'>default</label>
                        </div>
                    </article>
                    <article className="codeBox mt-2 pl-2 pr-2 sm:pl-0 sm:pr-0">
                        <div className=''>
                            <h4 className='mb-2'>미리보기</h4>
                            <div id='code' className={'code ' + useEditor}></div>
                        </div>
                        <div className='mt-5'>
                            <h4 className='mb-2'>code 작성</h4>
                            <textarea id='textarea' placeholder='작성하고 싶으신 내용을 적어주시면 됩니다. 사이트에 노출되는 화면은 상단 미리보기와 동일할 것입니다.' value={code} onChange={(e) => {setCode(e.target.value)}} onKeyUp={(e) => {compiler('code', e)}} onKeyDown={(e) => {key(e)}}></textarea>
                        </div>
                    </article>
                    <div className='btnGroup text-right w-full mt-5'>
                    <button className='btn delete' onClick={deleteCode}>삭제</button>
                        <a href={'/code?idx=' + idx} className='btn'>취소</a>
                        <button className='btn apply' onClick={submit}>수정</button>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}