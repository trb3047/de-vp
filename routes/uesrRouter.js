import express from 'express';
import { signup, loginCheck, idCheck, nickCheck } from '../controllers/user.js';

//라우터 - 해당 경로로 접근시 연결한다
const router = express.Router();

//회원가입
router.post('/signup', signup);	
//로그인
router.post('/loginCheck', loginCheck);
//id체크
router.post('/idCheck', idCheck);
//닉네임 체크
router.post('/nickCheck', nickCheck);

export default router;