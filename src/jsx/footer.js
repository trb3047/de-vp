import React from 'react';

//하단 레이아웃
export default function Footer() {
    return (
        <footer className='text-center pt-5 pb-5 border-t'>
            <dl className='flex justify-center text-sm text-gray-500'>
                <dt className="blind">관련 사이트 링크</dt>
                <dd><a href="https://github.com/trb3047/de-vp/" target="_blank" rel="noopener noreferrer">소스코드 GitHub</a></dd>
            </dl>
            <p className="copy mt-3 text-sm">Copyright © 2024 최성훈 BLKLIME<br />tailwindcss / react / nodejs / GitHub / Nginx / AWS (EC2, RDS, ROUTE 53)</p>
        </footer>
    );
}
