import { 
        getUsersDB,
        getCodesDB,
        getCommentsDB,
        blockUsersDB,
        notBlockUsersDB,
        userLevelUpDB,
        codeLevelUpDB,
        codePrivateYDB,
        codePrivateNDB,
        commentPrivateYDB,
        commentPrivateNDB,
        goOutDB,
        getTagDB,
        addTagDB
    } from '../database/userDB.js';

export async function getUsers(req, res) {
    try {
        const data = await getUsersDB();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getCodes(req, res) {
    try {
        const data = await getCodesDB();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getComments(req, res) {
    try {
        const data = await getCommentsDB();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function blockUsers(req, res) {
    try {
        const data = await blockUsersDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function notBlockUsers(req, res) {
    try {
        const data = await notBlockUsersDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function userLevelUp(req, res) {
    try {
        const data = await userLevelUpDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function codeLevelUp(req, res) {
    try {
        const data = await codeLevelUpDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function codePrivateY(req, res) {
    try {
        const data = await codePrivateYDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function codePrivateN(req, res) {
    try {
        const data = await codePrivateNDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function commentPrivateY(req, res) {
    try {
        const data = await commentPrivateYDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function commentPrivateN(req, res) {
    try {
        const data = await commentPrivateNDB(req.body);
        res.status(200).json('처리 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function goOut(req, res) {
    const { userID } = req.body;
    try {
        const data = await goOutDB(userID);
        if(data[0].level === 0) res.status(200).json('차단된 ID입니다');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function getTag(req, res) {
    try {
        const data = await getTagDB();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export async function addTag(req, res) {
    const { title, name, color } = req.body;
    try {
        const data = await addTagDB({ title: title, name: name, color: color });
        res.status(200).json('추가 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

export default getUsers;