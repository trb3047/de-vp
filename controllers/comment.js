import { getComment, commentApplyDB, commentEditDB, commentDeleteDB } from '../database/userDB.js';

export async function getCommentList(req, res) {
    const { codeID } = req.body;
    try {
        const data = await getComment(codeID);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function commentApply(req, res) {
    const { codeID, commentID, userID,  userNick, context, date } = req.body;
    try {
        const data = await commentApplyDB([ codeID, commentID, userID,  userNick, context, date ]);
        res.status(200).json('댓글 작성 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function commentEdit(req, res) {
    const { idx, context, date } = req.body;
    try {
        const codeApplyF = await commentEditDB([ idx, context, date ]);
        //저장 완료 후 메세지 보내기
        res.status(200).json('댓글 수정 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function commentDelete(req, res) {
    const { idx, codeID, commentID } = req.body;
    try {
        const codeData = await commentDeleteDB({ idx: idx, codeID: codeID, commentID: commentID });
        res.status(200).json('댓글 삭제 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}
export default getCommentList;