import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcrypt';
import { userDB, getUser, signUp, getId, getNick } from '../database/userDB.js';

//텍스트 값을 hash로 변환
const textToHash = async (text) => {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(text, saltRounds);
        return hash;
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
    const { userID, userPW, userNick, userEmail, level } = req.body;
    try {
        //비밀번호를 해시값으로 변환
        const resHash = await textToHash(userPW);
        //통과된 id와 변환된 비밀번호로 DB에 저장
        const userApply = await signUp([userID, resHash, userNick, userEmail, level]);
        //저장 완료 후 메세지 보내기
        res.status(200).json('회원 가입 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const loginCheck = async (req, res) => {
    const { userID, userPW } = req.body;

    try {
        const userCheck = await getUser(userID);
        if (!userCheck.length) return res.status(401).json('존재하지 않는 아이디입니다.');

        const blobToStr = Buffer.from(userCheck[0].userPW).toString();
        const isMatch = await hashCompare(userPW, blobToStr);
        if (!isMatch) return res.status(401).json('비밀번호가 일치하지 않습니다.');

        const { userNick: nick, userEmail: email, level: lev } = userCheck[0];
        res.status(200).json({ userNick: nick, userEmail: email, level: lev });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const idCheck = async (req, res) => {
    const { userID } = req.body;
    try {
        const userCheck = await getId(userID);
        //console.log(userCheck);
        if (userCheck.length) {
            res.status(401).json('중복된 ID입니다');
            return;
        }
        res.status(200).json('사용 가능한 ID입니다');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const nickCheck = async (req, res) => {
    const { userNick } = req.body;
    try {
        const userCheck = await getNick(userNick);
        //console.log(userCheck);
        if (userCheck.length) {
            res.status(401).json('중복된 닉네임입니다');
            return;
        }
        res.status(200).json('사용 가능한 닉네임입니다');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}


export default signup;
export { signup, loginCheck, idCheck, nickCheck };
