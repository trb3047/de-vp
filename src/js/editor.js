/*
 * html, javascript 코드를 브라우저에서 확인할 수 있도록 변환시키는 에디터 
 * 
 * 버전 1.0.0
 * 2024-06-18
 * 
 * 작성자
 * 최성훈 | blklime
 * 
 */

export default function editor(val) {
    try {
        if (!val) return '';
        //<> 태그 택스트로 변환
        let result = val;
        //텍스트로 들어간 html 코드 변환
        result = result.replaceAll(';\n', '&#59;\n');
        result = result.replaceAll(',', '&#44;');
        result = result.replaceAll('<', '&lt;');
        result = result.replaceAll('>', '&gt;');
        result = result.replaceAll('/*', '&#47;&#42;');
        result = result.replaceAll('*/', '&#42;&#47;');
        result = result.replaceAll('//', '&#47;&#47;');
        result = result.replaceAll("'", '&#39;');
        result = result.replaceAll('"', '&#34;');
        result = result.replaceAll('  ', '&nbsp;&nbsp;');
        //줄바꿈 기준으로 반복문 개시
        result = result.split('\n');
        let num = '<p>';
        let code = '<code>';
        //여러줄 주석을 위한 타이머
        let timer = false;

        for (let e in result) {
            let target = result[e];
            let ret = '';
            num += '<span class="num">' + (Number(e) + 1) + '</span>';
            code += '<p>';
            //console.log(target);
            //주석을 사용할 경우
            if (target.length >= 1 && target[0].match('#')) {
                ret += '<span class="annoDefault">' + target + '</span>';
            } else if (target.match('&#47;&#47;') && !target.match('&#34;&#47;&#47;&#34;') && !target.match('&#39;&#47;&#47;&#39;') && !target.match('&#47;&#47;&#39;') && !target.match('&#47;&#47;&#34;')) {
                //여러줄 주석 중단
                let anno = target.replace('&#47;&#47;', '\\').split('\\');
                if (!anno[0].match('&#47;&#47;')) {
                    let annoRet = anno.shift();
                    ret += replaceA(annoRet) + '<span class="anno">&#47;&#47;' + anno.join('') + '</span>';
                } else {
                    ret += '<span class="anno">&#47;&#47;' + target + '</span>';
                }
            }
            //여러 줄 주석
            else if ((target.match('&#47;&#42;') && !target.match('&#39;&#47;&#42;') && !target.match('&#34;&#47;&#42;') && !target.match('&#47;&#42;&#39;') && !target.match('&#47;&#42;&#34;')) || (target.match('&#42;&#47;') && !target.match('&#42;&#47;&#34;') && !target.match('&#42;&#47;&#39;') && !target.match('&#34;&#42;&#47;') && !target.match('&#39;&#42;&#47;')) || timer ) {
                if (target.match('&#42;&#47;') && target.match('&#47;&#42;')) {
                    let spt = target.replace('&#47;&#42;', '\\').split('\\');
                    // /* 이 전 정보 저장
                    let annoRet = spt.shift();
                    spt = spt.join('');
                    spt = spt.replace('&#42;&#47;', '\\').split('\\');
                    // */ 이 후 정보 저장
                    let annoRet2 = spt.pop(); 
                    ret += replaceA(annoRet) + '<span class="anno">&#47;&#42;' + spt.join('') + '&#42;&#47;</span>' + replaceA(annoRet2);
                    timer = false;
                }
                else if (target.match('&#42;&#47;') && !target.match('&#47;&#42;')) {
                    let spt = target.replace('&#42;&#47;', '\\').split('\\');
                    let annoRet = spt.shift();
                    ret += '<span class="anno">' + annoRet + '&#42;&#47;</span>' + spt.join('');
                    //끝나면 초기화
                    timer = false;
                } 
                //한 줄에 해당 주석하고 다른 코드 같이 있을 때
                else if (!timer) {
                    //시작하면 타이머 on
                    timer = true;
                    let spt = target.replace('&#47;&#42;', '\\').split('\\');
                    let annoRet = spt.shift();
                    ret += replaceA(annoRet) + '<span class="anno">&#47;&#42;' + spt.join('') + '</span>';
                } else {
                    ret += '<span class="anno">' + target + '</span>';
                }
                    
            }
            //주석이 아닌 경우
            else {
                ret += replaceA(target);
            }
            code += ret + '</p>';
        }

        num += '</p>';
        code += '</code>';

        return num + code;

    } catch (err) {
        console.log(err);
    }
}

function replaceA(target) {
    target = target.replace('function ', '<i>function</i> ');
    target = target.replace('async ', '<i>async</i> ');
    target = target.replace('const ', '<i>const</i> ');
    target = target.replace('let ', '<i>let</i> ');
    target = target.replace('var ', '<i>var</i> ');
    target = target.replace(' in ', ' <i>in</i> ');
    target = target.replace(' of ', ' <i>of</i> ');
    target = target.replace('continue ', '<i>continue</i> ');
    target = target.replace('if ', '<b>if</b> ');
    target = target.replace('else ', '<b>else</b> ');
    target = target.replace('return ', '<b>return</b> ');
    target = target.replace('for ', '<b>for</b> ');
    target = target.replace('while ', '<b>while</b> ');
    target = target.replace('case ', '<b>case</b> ');
    target = target.replace('switch ', '<b>swith</b> ');
    target = target.replace('break;', '<b>break</b>;');
    target = target.replace('export ', '<b>export</b> ');
    target = target.replace('default ', '<b>default</b> ');
    target = target.replace('import ', '<b>import</b> ');
    target = target.replace('from ', '<b>from</b> ');
    target = target.replace('try ', '<b>try</b> ');
    target = target.replace('catch ', '<b>catch</b> ');
    target = target.replace('throw ', '<b>throw</b> ');
    target = target.replaceAll(' + ', ' <span class="text-white">+</span> ');
    target = target.replaceAll(' - ', ' <span class="text-white">-</span> ');
    target = target.replaceAll(' * ', ' <span class="text-white">*</span> ');
    target = target.replaceAll(' / ', ' <span class="text-white">/</span> ');
    target = target.replaceAll(' % ', ' <span class="text-white">%</span> ');
    target = target.replaceAll(' && ', ' <span class="text-white">&&</span> ');
    target = target.replaceAll(' || ', ' <span class="text-white">||</span> ');
    target = target.replaceAll(' = ', ' <span class="text-white">=</span> ');
    target = target.replaceAll(' == ', ' <span class="text-white">==</span> ');
    target = target.replaceAll(' === ', ' <span class="text-white">===</span> ');
    target = target.replaceAll(' !== ', ' <span class="text-white">!==</span> ');
    target = target.replaceAll(' != ', ' <span class="text-white">!=</span> ');
    target = target.replaceAll(' += ', ' <span class="text-white">+=</span> ');
    target = target.replaceAll(' -= ', ' <span class="text-white">-=</span> ');
    target = target.replaceAll(' %= ', ' <span class="text-white">%=</span> ');
    target = target.replaceAll(' &= ', ' <span class="text-white">&=</span> ');
    target = target.replaceAll(' *= ', ' <span class="text-white">*=</span> ');
    target = target.replaceAll(' ** ', ' <span class="text-white">**</span> ');
    target = target.replaceAll(' ++ ', ' <span class="text-white">++</span> ');
    target = target.replaceAll(' -- ', ' <span class="text-white">--</span> ');
    target = target.replaceAll(' &lt; ', ' <span class="text-white">&lt;</span> ');
    target = target.replaceAll(' &lt;= ', ' <span class="text-white">&lt;=</span> ');
    target = target.replaceAll(' &lt;== ', ' <span class="text-white">&lt;==</span> ');
    target = target.replaceAll(' &gt; ', ' <span class="text-white">&gt;</span> ');
    target = target.replaceAll(' &gt;= ', ' <span class="text-white">&gt;=</span> ');
    target = target.replaceAll(' &gt;== ', ' <span class="text-white">&gt;==</span> ');
    target = target.replaceAll(' &lt; ', ' <span class="text-white"><</span> ');
    target = target.replaceAll(' &lt;= ', ' <span class="text-white"><=</span> ');
    target = target.replaceAll(' &lt;== ', ' <span class="text-white"><==</span> ');
    target = target.replaceAll(' &gt; ', ' <span class="text-white">></span> ');
    target = target.replaceAll(' &gt;= ', ' <span class="text-white">>=</span> ');
    target = target.replaceAll(' &gt;== ', ' <span class="text-white">==</span> ');
    target = target.replaceAll('&#59;', '<span class="text-white">&#59;</span>');
    target = target.replaceAll('&#44; ', '<span class="text-white">&#44;</span> ');
    // target = target.replace(/(&#39;)(.*[&#39;^&#34;{0,1}]?)(&#39;)/g, '<span class="text-orange-300">$1$2$3</span>');
    // target = target.replace(/(&#34;)(.*[&#34;^&#39;{0,1}]?)(&#34;)/g, '<span class="text-orange-300">$1$2$3</span>');
    return target;
}