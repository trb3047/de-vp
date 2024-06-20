import express from 'express';
import { signup, loginCheck, idCheck, nickCheck, findID, findPW, editPW } from '../controllers/user.js';
import { codeApply, codeEdit, codeDelete, getCodeList, getCodeV, getCodeSearch } from '../controllers/code.js'

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
//id찾기
router.post('/findID', findID);
//비밀번호 찾기
router.post('/findPW', findPW);
//비밀번호 변경
router.post('/editPW', editPW);

//코드 작성
router.post('/codeApply', codeApply);
//코드 수정
router.post('/codeEdit', codeEdit);
//코드 / 삭제
router.post('/codeDelete', codeDelete);
//코드 가져오기 
router.post('/getCode', getCodeList);
//코드 가져오기 / my 상세
router.post('/getCodeView', getCodeV);
//코드 / 검색
router.post('/getCodeSearch', getCodeSearch);

export default router;