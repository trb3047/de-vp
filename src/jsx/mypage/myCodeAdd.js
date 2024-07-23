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
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const userLevel = secureStorage.getItem('level');
    const [tit, setTit] = useState('');
    const [desc, setDesc] = useState('');
    const [code, setCode] = useState('');
    const [tag, setTag] = useState('JS');
    const [tagColor, setTagColor] = useState('');
    const [privat, setPrivate] = useState('Y');
    const [useEditor, setUseEdittor] = useState('JS');
    let chkTimer = 0;

    //에디터 관련
    function compiler(id) {
        const codeBox = document.getElementById(id);
        codeBox.innerHTML = codeEditor(code);
    }

    function key(obj) {
        const keyCode = obj.keyCode;
        //탭
        if (keyCode === 9) {
            setCode(code + '    ');
            obj.preventDefault();
        }
    }

    async function submit () {
        if (chkTimer !== 0) return;
        if (!tit) return alert('제목을 입력해 주세요');
        if (!desc) return alert('부가 설명을 입력해 주세요');
        if (!code) return alert('code를 작성해 주세요');

        try {
            chkTimer = 1;
            const today = new Date();
            const thisDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

            const res = await fetch('/api/codeApply', {
                method: 'POST',
                body: JSON.stringify({ userID: userID, userNick: userNick, title: tit, desc: desc, context: code, tag: tag, private: privat, level: userLevel, date: thisDate, editor: useEditor, tagColor: tagColor }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.status === 200) {
                alert(data);
                navigate('/myCode?tag=ALL');
            }
            if (res.status === 500) console.log(data);
            chkTimer = 0;
        } 
        catch(err) {
            console.log(err);
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
                    setTagColor(val.color);
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
        getTags();
    }, [])

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
                            <input type="text" id="desc" placeholder="부가 설명을 입력해 주세요" className="input w-full mt-2" value={desc} onChange={(e) => setDesc(e.target.value)} />
                        </li>
                    </ul>
                    <article className='searchGroup text-right overflow-hidden mt-5'>
                       <div className='category sort sm:float-right sm:ml-5 sm:pl-5 sm:border-l'>
                            <p className='blind'>공개 선택</p>
                            <input type='radio' name='private' id='public' defaultChecked value='Y' onChange={() => {setPrivate('Y')}} />
                            <label htmlFor='public'>공개</label>
                            <input type='radio' name='private' id='secret' value='N' onChange={() => {setPrivate('N')}} />
                            <label htmlFor='secret'>비공개</label>
                        </div>
                       <div id='tags' className='category mt-3 sm:mt-0 sm:float-right sm:ml-5 sm:pl-5 sm:border-l'>
                            
                        </div>
                        <div className='category sort mt-3 sm:mt-0 sm:float-right sm:text-right'>
                            <p className='blind'>언어 선택</p>
                            <input type='radio' name='lang' id='javascript' defaultChecked value='JS' onChange={() => setUseEdittor('JS')} />
                            <label htmlFor='javascript'>javascript</label>
                            <input type='radio' name='lang' id='default' value='default' onChange={() => setUseEdittor('default')} />
                            <label htmlFor='default'>default</label>
                        </div>
                    </article>
                    <article className="codeBox mt-2 pl-2 pr-2 sm:pl-0 sm:pr-0">
                        <div className=''>
                            <h4 className='mb-2'>미리보기</h4>
                            <div id='code1' className={'code ' + useEditor}></div>
                        </div>
                        <div className='mt-5'>
                            <h4 className='mb-2'>code 작성</h4>
                            <textarea id='textarea' placeholder='작성하고 싶으신 내용을 적어주시면 됩니다. 사이트에 노출되는 화면은 상단 미리보기와 동일할 것입니다.' value={code} onChange={(e) => {setCode(e.target.value)}} onKeyUp={(e) => {compiler('code1', e)}} onKeyDown={(e) => {key(e)}}></textarea>
                        </div>
                    </article>
                    <div className='btnGroup text-right w-full mt-5'>
                        <a href='/myCode' className='btn'>취소</a>
                        <button className='btn apply' onClick={submit}>code 작성</button>
                    </div>
                </div>
            </main>
            <Footer />
        </React.StrictMode>
    );
}