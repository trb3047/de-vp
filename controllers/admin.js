import { getUsersDB, getCodesDB, getCommentsDB, blockUsersDB, notBlockUsersDB, levelUpDB, codePrivateYDB, codePrivateNDB, commentPrivateYDB, commentPrivateNDB } from '../database/userDB.js';

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

export async function levelUp(req, res) {
    try {
        const data = await levelUpDB(req.body);
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

export default getUsers;