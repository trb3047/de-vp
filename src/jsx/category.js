import React from 'react';

export default class Category extends React.Component {
    render() {
        return (
            <React.StrictMode>
            <article className='searchGroup text-right overflow-hidden pr-2'>
                <div className='category sort float-right ml-5 pl-5 border-l'>
                    <p className='blind'>정렬 선택</p>
                    <input type='radio' name='sort' id='sort_lastest' defaultChecked />
                    <label htmlFor='sort_lastest'>최신</label>
                    <input type='radio' name='sort' id='sort_pop' />
                    <label htmlFor='sort_pop'>인기</label>
                </div>
                <div className='category float-right'>
                    <p className='blind'>대분류 선택</p>
                    <input type='checkbox' name='category1' id='cate_All' defaultChecked />
                    <label htmlFor='cate_All'>전체</label>
                    <input type='checkbox' name='category1' id='cate1' />
                    <label htmlFor='cate1'>javascript</label>
                    <input type='checkbox' name='category1' id='cate2' />
                    <label htmlFor='cate2'>Git</label>
                </div>
                <div className='searchBox float-right w-full mt-5 mb-5'>
                    <p className='blind'>검색 하기</p>
                    <div className='relative pr-14'>
                        <input className='input' type='text' placeholder='검색어 입력' value='' />
                        <button className='btn w-18 absolute top-0 right-0'>검색</button>  
                    </div>
                </div>
            </article> 
            </React.StrictMode>
        );
    }
  
  }
