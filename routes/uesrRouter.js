import express from 'express';
import { signup, loginCheck, idCheck, nickCheck, findID, findPW, editPW, addFavorCode, getFavorCode, deleteFavorCode } from '../controllers/user.js';
import { codeApply, codeEdit, codeDelete, getCodeList, getCodeV, getCodeSearch, getCodeFavorite, upRecomand, downRecomand } from '../controllers/code.js';
import { getCommentList, commentApply, commentEdit, commentDelete } from '../controllers/comment.js';
import { getUsers, getCodes, getComments, blockUsers, notBlockUsers, levelUp, codePrivateY, codePrivateN, commentPrivateY, commentPrivateN } from '../controllers/admin.js';

//라우터 - 해당 경로로 접근시 연결한다
const userRouter = express.Router();

//회원가입
userRouter.post('/signup', signup);	
//로그인
userRouter.post('/loginCheck', loginCheck);
//id체크
userRouter.post('/idCheck', idCheck);
//닉네임 체크
userRouter.post('/nickCheck', nickCheck);
//id찾기
userRouter.post('/findID', findID);
//비밀번호 찾기
userRouter.post('/findPW', findPW);
//비밀번호 변경
userRouter.post('/editPW', editPW);


//코드 작성
userRouter.post('/codeApply', codeApply);
//코드 수정
userRouter.post('/codeEdit', codeEdit);
//코드 / 삭제
userRouter.post('/codeDelete', codeDelete);
//코드 가져오기 
userRouter.post('/getCode', getCodeList);
//코드 가져오기 / my 상세
userRouter.post('/getCodeView', getCodeV);
//코드 / 검색
userRouter.post('/getCodeSearch', getCodeSearch);
//코드 / 즐겨찾기
userRouter.post('/getCodeFavorite', getCodeFavorite);

//댓글 작성
userRouter.post('/commentApply', commentApply);
//댓글 작성
userRouter.post('/commentEdit', commentEdit);
//댓글 작성
userRouter.post('/commentDelete', commentDelete);
//댓글 가져오기 
userRouter.post('/getComment', getCommentList);

//즐겨찾기 추가
userRouter.post('/addFavorCode', addFavorCode);
userRouter.post('/getFavorCode', getFavorCode);
userRouter.post('/deleteFavorCode', deleteFavorCode);
userRouter.post('/upRecomand', upRecomand);
userRouter.post('/downRecomand', downRecomand);

//관리자
userRouter.post('/getUsers', getUsers);
userRouter.post('/getCodes', getCodes);
userRouter.post('/getComments', getComments);
userRouter.post('/blockUsers', blockUsers);
userRouter.post('/notBlockUsers', notBlockUsers);
userRouter.post('/levelUp', levelUp);
userRouter.post('/codePrivateY', codePrivateY);
userRouter.post('/codePrivateN', codePrivateN);
userRouter.post('/commentPrivateY', commentPrivateY);
userRouter.post('/commentPrivateN', commentPrivateN);


export default userRouter;