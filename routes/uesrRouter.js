import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, loginCheck, idCheck, nickCheck, findID, findPW, editPW, addFavorCode, getFavorCode, deleteFavorCode } from '../controllers/user.js';
import { codeApply, codeEdit, codeDelete, getCodeList, getCodeV, getCodeSearch, getCodeFavorite, upRecomand, downRecomand } from '../controllers/code.js';
import { getCommentList, commentApply, commentEdit, commentDelete } from '../controllers/comment.js';
import { getUsers, getCodes, getComments, blockUsers, notBlockUsers, userLevelUp, codeLevelUp, codePrivateY, codePrivateN, commentPrivateY, commentPrivateN, goOut, getTag, addTag } from '../controllers/admin.js';

//라우터 - 해당 경로로 접근시 연결한다
const userRouter = express.Router();

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    message: '트래픽 초과'
})

//회원가입
userRouter.post('/signup', apiLimiter, signup);	
//로그인
userRouter.post('/loginCheck', apiLimiter, loginCheck);
//id체크
userRouter.post('/idCheck', apiLimiter, idCheck);
//닉네임 체크
userRouter.post('/nickCheck', apiLimiter, nickCheck);
//id찾기
userRouter.post('/findID', apiLimiter, findID);
//비밀번호 찾기
userRouter.post('/findPW', apiLimiter, findPW);
//비밀번호 변경
userRouter.post('/editPW', apiLimiter, editPW);


//코드 작성
userRouter.post('/codeApply', apiLimiter, codeApply);
//코드 수정
userRouter.post('/codeEdit', apiLimiter, codeEdit);
//코드 / 삭제
userRouter.post('/codeDelete', apiLimiter, codeDelete);
//코드 가져오기 
userRouter.post('/getCode', apiLimiter, getCodeList);
//코드 가져오기 / my 상세
userRouter.post('/getCodeView', apiLimiter, getCodeV);
//코드 / 검색
userRouter.post('/getCodeSearch', apiLimiter, getCodeSearch);
//코드 / 즐겨찾기
userRouter.post('/getCodeFavorite', apiLimiter, getCodeFavorite);

//댓글 작성
userRouter.post('/commentApply', apiLimiter, commentApply);
//댓글 작성
userRouter.post('/commentEdit', apiLimiter, commentEdit);
//댓글 작성
userRouter.post('/commentDelete', apiLimiter, commentDelete);
//댓글 가져오기 
userRouter.post('/getComment', apiLimiter, getCommentList);

//즐겨찾기 추가
userRouter.post('/addFavorCode', apiLimiter, addFavorCode);
userRouter.post('/getFavorCode', apiLimiter, getFavorCode);
userRouter.post('/deleteFavorCode', apiLimiter, deleteFavorCode);
userRouter.post('/upRecomand', apiLimiter, upRecomand);
userRouter.post('/downRecomand', apiLimiter, downRecomand);

//관리자
userRouter.post('/getUsers', apiLimiter, getUsers);
userRouter.post('/getCodes', apiLimiter, getCodes);
userRouter.post('/getComments', apiLimiter, getComments);
userRouter.post('/blockUsers', apiLimiter, blockUsers);
userRouter.post('/notBlockUsers', apiLimiter, notBlockUsers);
userRouter.post('/userLevelUp', apiLimiter, userLevelUp);
userRouter.post('/codeLevelUp', apiLimiter, codeLevelUp);
userRouter.post('/codePrivateY', apiLimiter, codePrivateY);
userRouter.post('/codePrivateN', apiLimiter, codePrivateN);
userRouter.post('/commentPrivateY', apiLimiter, commentPrivateY);
userRouter.post('/commentPrivateN', apiLimiter, commentPrivateN);
userRouter.post('/getTag', apiLimiter, getTag);
userRouter.post('/addTag', apiLimiter, addTag);

//차단
userRouter.post('/goOut', apiLimiter, goOut);


export default userRouter;