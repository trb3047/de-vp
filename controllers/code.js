import { codeApplyDB, codeEditDB, codeDeleteDB, getCode, getCodeView, getCodeSearching, getCodeFavoriteDB, upRecomandDB, downRecomandDB } from '../database/userDB.js';

//code 저장
export async function codeApply(req, res) {
    const { userID, userNick, title, desc, context, tag, private: privat, level, date, editor, tagColor } = req.body;
    try {
        const codeApplyF = await codeApplyDB([userID, userNick, title, desc, context, tag, privat, level, date, editor, tagColor]);
        //저장 완료 후 메세지 보내기
        res.status(200).json('code 작성 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function codeEdit(req, res) {
    const { idx, title, desc, context, tag, private: privat, date, editor, tagColor } = req.body;
    try {
        const codeApplyF = await codeEditDB([idx, title, desc, context, tag, privat, date, editor, tagColor]);
        //저장 완료 후 메세지 보내기
        res.status(200).json('code 수정 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function codeDelete(req, res) {
    const { idx } = req.body;
    try {
        const codeData = await codeDeleteDB(idx);
        res.status(200).json('code 삭제 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getCodeList(req, res) {
    const { userID } = req.body;
    try {
        const codeData = await getCode(userID);
        res.status(200).json(codeData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getCodeV(req, res) {
    const { idx } = req.body;
    try {
        const codeData = await getCodeView(idx);
        res.status(200).json(codeData[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getCodeFavorite(req, res) {
    const { userID } = req.body;
    try {
        const data = await getCodeFavoriteDB(userID);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getCodeSearch(req, res) {
    let { tag, sort, search, page, level } = req.body;

    try {
        const codeData = await getCodeSearching({ tag: tag, sort: sort, search: search, page: page, level: level });
        
        if (codeData.length) res.status(200).json(codeData);
        else res.status(401).json('검색 결과가 없습니다');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function upRecomand(req, res) {
    const { idx } = req.body;
    try {
        const retEdit = await upRecomandDB(idx);
        
        res.status(200).json();
    }   catch (err) {
        console.error(err);
        res.status(500).json(err);
    }  
}

export async function downRecomand(req, res) {
    const { idx } = req.body;
    try {
        const retEdit = await downRecomandDB(idx);
        
        res.status(200).json();
    }   catch (err) {
        console.error(err);
        res.status(500).json(err);
    }  
}

export default codeApply;