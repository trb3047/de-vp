import React, { useEffect, useState } from 'react';
//보안 강화한 local storage
import secureLocalStorage from 'react-secure-storage';

export default function Comment () {
    const secureStorage = secureLocalStorage.default;
    const userID = secureStorage.getItem('id');
    const userNick = secureStorage.getItem('nick');
    const idx = new URL(window.location.href).searchParams.get('idx');
    const [comment, setComment] = useState('');
    let commentID = 0;

    async function commentAll () {
        const res = await fetch('/api/getComment', {
            method: 'POST',
            body: JSON.stringify({ codeID: idx }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        let data = await res.json();
        
        if(res.status === 200) {
            let commentBox = document.getElementById('commentList');
            let commentList = '';
            data.map((val) => {
                if (val.commentID === 0) {
                    commentList += 
                        `<li data-depth='1'>`
                        +    `<p class='nick'>${val.date} | ${val.userNick}</p>`
                        +    `<p class='cont'>${(val.private === 'N') ? '[ 비공개 처리된 댓글입니다 ]' : val.context}</p>`
                        +    `<div class='btnGroup'>`
                        +       `<button class='btn add' data-idx='${val.idx}'>댓글</button>`
                        +       `${(userID === val.userID) ? '<button class="btn delete" data-idx="' + val.idx + '">삭제</button><button class="btn apply edit" data-idx="' + val.idx + '">수정</button>' : ''}`
                        +    `</div>`
                        +    `<ol class='comment inner'>`;
                
                    data.map((innerVal) => {
                        if (innerVal.commentID === val.idx) {
                            commentList +=
                                        `<li>`
                                        +    `<p class='nick'>${innerVal.date} | ${innerVal.userNick}</p>`
                                        +    `<p class='cont'>${innerVal.context}</p>`
                                        +    `<div class='btnGroup'>`
                                        +       `${(userID === innerVal.userID) ? '<button class="btn delete" data-idx="' + innerVal.idx + '">삭제</button><button class="btn apply edit" data-idx="' + innerVal.idx + '">수정</button>' : ''}`    
                                        +    `</div>`
                                        + `</li>`;
                        }
                    })

                    commentList += 
                                `</ol>`
                            + `</li>`;

                }
            })
            commentBox.innerHTML = commentList;

            let btnAdd = document.querySelectorAll('.comment .btn.add');
            let btnDel = document.querySelectorAll('.comment .btn.delete');
            let btnEdit = document.querySelectorAll('.comment .btn.edit');

            //댓글 작성
            [...btnAdd].map((val) => {
                val.onclick = function (e) {
                    let target = e.target.parentElement.parentElement;
                    let targetIdx = e.target.getAttribute('data-idx');

                    target.innerHTML = target.innerHTML
                                +`<article class='comment add'>`
                                +`<form action='javascript:;' data-target='${targetIdx}'>`
                                +    `<dl>`
                                +        `<dt class='blind'>댓글 작성</dt>`
                                +        `<dd class='write'>`
                                +            `<input class='input' type='text' placeholder='하고 싶은 말을 적어주세요' />`
                                +            `<input class='btn' type='submit' value='작성' />`
                                +        `</dd>`
                                +    `</dl>`
                                +`</form>`
                                +`</article>`;

                    target.querySelector('.input').focus();

                    target.querySelector('form').onsubmit = async function (e) {
                        if(!userNick) return alert('로그인이 필요합니다');
                        let commentIndex = e.target.getAttribute('data-target');
                        try {
                            const today = new Date();
                            const thisDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
                            
                            const res = await fetch('/api/commentApply', {
                                method: 'POST',
                                body: JSON.stringify({ codeID: idx, commentID: commentIndex, userID: userID,  userNick: userNick, context: target.querySelector('.input').value, date: thisDate }),
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' }
                            });
                
                            let data = await res.json();
                            
                            if(res.status === 200) {
                                alert(data);
                                commentAll();
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            });
            
            //댓글 수정
            [...btnEdit].map((val) => {
                val.onclick = function (e) {
                    let target = e.target.parentElement.parentElement;
                    let num = e.target.getAttribute('data-idx');
                    let cont = target.querySelector('.cont');
                    cont.innerHTML = 
                                `<form action='javascript:;' data-target=${num}>`
                                +    `<dl class='mt-2 mb-2'>`
                                +        `<dt class='blind'>댓글 작성</dt>`
                                +        `<dd class='write'>`
                                +            `<input class='input' type='text' value='${cont.innerText}' />`
                                +            `<input class='btn' type='submit' value='작성' />`
                                +        `</dd>`
                                +    `</dl>`
                                +`</form>`;

                    target.querySelector('.input').focus();
                    
                    target.querySelector('form').onsubmit = async function (e) {
                        let commentIdx = e.target.getAttribute('data-target');
                        try {
                            const today = new Date();
                            const thisDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
                            
                            const res = await fetch('/api/commentEdit', {
                                method: 'POST',
                                body: JSON.stringify({ idx: commentIdx, context: target.querySelector('.input').value, date: thisDate }),
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' }
                            });
                
                            let data = await res.json();
                            
                            if(res.status === 200) {
                                alert(data);
                                commentAll();
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            });
            
            //댓글 삭제
            [...btnDel].map((val) => {
                val.onclick = async function (e) {
                    let target = e.target.parentElement.parentElement;
                    let commentIdx = e.target.getAttribute('data-idx');
                    let sql = (Number(target.getAttribute('data-depth')) !== 1) ? { idx: commentIdx } : { idx: commentIdx, codeID: idx, commentID: commentIdx };
    
                    try {
                        const res = await fetch('/api/commentDelete', {
                            method: 'POST',
                            body: JSON.stringify(sql),
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' }
                        });
            
                        let data = await res.json();
                        
                        if(res.status === 200) {
                            alert(data);
                            commentAll();
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        }
    }
    const commentSubmit = async function () {
        if(!userNick) return alert('로그인이 필요합니다');
        try {
            const today = new Date();
            const thisDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
            
            const res = await fetch('/api/commentApply', {
                method: 'POST',
                body: JSON.stringify({ codeID: idx, commentID: commentID, userID: userID,  userNick: userNick, context: comment, date: thisDate }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            let data = await res.json();

            if(res.status === 200) {
                alert(data);
                commentAll();
                setComment('');
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        commentAll();
    }, [commentAll])
    
    return (
        <React.StrictMode>
            <article className='comment add'>
            <form action='javascript:;' onSubmit={commentSubmit}>
                <dl>
                    <dt className='blind'>댓글 작성</dt>
                    <dd className='write'>
                        <input className='input' type='text' placeholder='하고 싶은 말을 적어주세요' value={comment} onChange={(e) => setComment(e.target.value)} />
                        <input className='btn' type='submit' value='작성' />
                    </dd>
                </dl>
            </form>
            </article>
            <ol className='comment' id='commentList'></ol>
        </React.StrictMode>
    )
}