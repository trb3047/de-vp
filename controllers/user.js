import bcrypt from 'bcrypt';
import { userDB, getUser, signUp } from '../database/userDB.js';

//텍스트 값을 hash로 변환
const textToHash = async (text) => {
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(text, saltRounds);
        return hash
    } catch (err) {
        console.error(err);
        return err;
    }
}

//해쉬값을 풀어서 확인
const hashCompare = async (inputValue, hash) => {
    try {
        const isMatch = await bcrypt.compare(inputValue, hash);
        if (isMatch) return true;
        else return false;
    } catch(err) {
        console.error(err);
        return err;
    }
}

//회원가입 처리
const signup = async (req, res) => {
    //클라이언트에서 보낸 정보 분해
    const { userID, userPW, userEmail, userPhone } = req.body;
    try {
        let userCheck = await getUser(userID);
        console.log(userCheck);
        //ID 중복 검사
        if (userCheck.length) {
            res.status(401).json('이미 존재하는 아이디입니다.');
            return;
        }
        //비밀번호를 해시값으로 변환
        const resHash = await textToHash(userPW);
        //통과된 id와 변환 된 비밀번호로 DB에 저장
        const userApply = await signUp([userID, resHash, userEmail, userPhone]);
        //저장 완료 후 메세지 보내기
        res.status(200).json('가입 성공');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const loginCheck = async (req, res) => {
    const { userID, userPW } = req.body;

    try {
        const userCheck = await getUser(userID);
        if (!userCheck.length) {
            res.status(401).json('존재하지 않는 아이디입니다.');
            return;
        }

        const blobToStr = Buffer.from(userCheck[0].userPW).toString();
        const isMatch = await hashCompare(userPW, blobToStr);

        if (!isMatch) {
            res.status(401).json('비밀번호가 일치하지 않습니다.');
            return;
        }
        res.status(200).json('로그인 성공');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export default signup;
export { signup, loginCheck };