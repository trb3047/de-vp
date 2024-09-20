import mysql from 'mysql2'; 

//mysql 연결 기본 설정
//user DB
const userDB = mysql.createConnection
({
  host: 'de-vp-db.c3giiyeg8ovh.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  database: 'my_db',
  password: ''
});

//DB 연결 체크
let conectTimer;
function dbConnect () {
  userDB.connect((err) => {
    if (err) {
      console.log(err);
      if (conectTimer) return;
      conectTimer = setTimeout(dbConnect, 1000);
    }
    else {
      console.log('DB 연결 성공');
    }
  });
}
dbConnect();

export function getUser(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM user where userID=? ;`, userID, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//id 찾기
export function getUserInEmail(userEmail) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM user where userEmail=? ;`, userEmail, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//ID 체크
export function getId(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT userID FROM user where userID=? ;`, userID, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//닉네임 체크
export function getNick(userNick) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT userNick FROM user where userNick=? ;`, userNick, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//DB에 회원가입 정보 넣기
export function signUp(data) {
  return new Promise((resolve, reject) => {
    userDB.query(`INSERT INTO user (userID, userPW, userNick, userEmail, level) VALUES (?, ?, ?, ?, ?) ;`, [...data], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//비밀번호 변경
export function getEditPW(data) {
  return new Promise((resolve, reject) => {
    userDB.query(`UPDATE user SET userPW=? WHERE userID=? ;`, [data[1], data[0]], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//DB에 code 넣기
export function codeApplyDB(data) {
  return new Promise((resolve, reject) => {
    userDB.query('INSERT INTO code (userID, userNick, title, `desc`, `context`, tag, private, level, `date`, editor, tagColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ;', [...data], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//DB에 code 수정
export function codeEditDB(data) {
  return new Promise((resolve, reject) => {
    userDB.query('UPDATE code SET title=?, `desc`=?, `context`=?, tag=?, private=?, `date`=?, editor=?, tagColor=? WHERE idx=? ;', [data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[0]], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//DB에 code 삭제
export function codeDeleteDB(idx) {
  return new Promise((resolve, reject) => {
    userDB.query('DELETE FROM code WHERE idx=? ;', idx, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//code 가져오기 / my 목록
export function getCode(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM code WHERE userID=? ;`, userID, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//code 가져오기 / my 즐겨찾기
export function getCodeFavoriteDB(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT favorCode FROM user WHERE userID='${userID}' ;`, (err, result) => {
      if (err) reject(err);
      else {
        let codeID = [];
        let sql = `SELECT * FROM code WHERE `;
        if (!result[0].favorCode) return reject;
        result[0].favorCode.split(',').map((val, index) => {
          if(val !== '') codeID.push(['idx', val]);
        });
        codeID.map((val, key) => {
          sql += (key === 0) ? `${val[0]}='${val[1]}'` : ` OR ${val[0]}='${val[1]}'`;
        });
        sql += ` ;`;

        userDB.query(sql, (error, ret) => {
          if (error) reject(error);
          else resolve(ret);
        });
      }
    })
  });
}

//code 가져오기 / 상세
export function getCodeView(idx) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM code where idx=? ;`, idx, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//code 가져오기 search
export function getCodeSearching(data) {
  let { tag, sort, search, page, level } = data;
  
  tag = (tag !== '*') ? ` AND tag="${tag}" ` : '';
  level = (level !== 0) ? ` AND level=${level} ` : '';
  search = (search !== '' && search.length > 1) ? ' AND (title LIKE ' + `"%${search}%"` + ' OR `desc` LIKE ' + `"%${search}%") ` : '';
  sort = (sort === 'DESC') ? ' ORDER BY date DESC' : ' ORDER BY recomand DESC'; 

  let sql = 'SELECT * FROM code WHERE private="Y"' 
  + tag
  + level
  + search
  + sort 
  + ' Limit ' + page + ', 10 ;';
  
  sql = sql.replaceAll('  ', ' ');
  
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//댓글 작성
export function commentApplyDB(data) {
  return new Promise((resolve, reject) => {
    userDB.query('INSERT INTO comment (codeID, commentID, userID, userNick, `context`, `date`) VALUES (?, ?, ?, ?, ?, ?) ;', [...data], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//댓글 수정
export function commentEditDB(data) {
  return new Promise((resolve, reject) => {
    userDB.query('UPDATE comment SET `context`=?, `date`=? WHERE idx=? ;', [data[1], data[2], data[0]], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//댓글 삭제
export function commentDeleteDB(data) {
  let { idx, codeID, commentID } = data;
  let sql = `DELETE FROM comment WHERE idx=${idx} ;`;
  if(commentID > 0) sql = `DELETE FROM comment WHERE idx=${idx} OR (codeID=${codeID} AND commentID=${commentID}) ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//댓글 가져오기
export function getComment(idx) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM comment WHERE codeID=${idx}`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//즐겨찾기 추가
export function addFavorCodeDB(data) {
  let { userID, favorCode } = data;
  return new Promise((resolve, reject) => {
    userDB.query(`UPDATE user SET favorCode=CONCAT(favorCode, '${favorCode}\,') WHERE userID='${userID}' ;`, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    })
  });
}

export function getFavorCodeDB(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT favorCode FROM user WHERE userID='${userID}'`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function deleteFavorCodeDB(data) {
  let { userID, favorCode } = data;
  return new Promise((resolve, reject) => {
    userDB.query(`UPDATE user SET favorCode='${favorCode}' WHERE userID='${userID}' ;`, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    })
  });
}

export function upRecomandDB(idx) {
  return new Promise((resolve, reject) => {
    userDB.query(`UPDATE code SET recomand=recomand+1 WHERE idx=${idx} ;`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function downRecomandDB(idx) {
  return new Promise((resolve, reject) => {
    userDB.query(`UPDATE code SET recomand=recomand-1 WHERE idx=${idx} ;`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//관리자 기능
export function getUsersDB() {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM user ORDER BY idx DESC`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function getCodesDB() {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM code ORDER BY idx DESC`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function getCommentsDB() {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM comment ORDER BY idx DESC`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function blockUsersDB(data) {
  let sql = `UPDATE user SET level=0 WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function notBlockUsersDB(data) {
  let sql = `UPDATE user SET level=1 WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function userLevelUpDB(data) {
  let sql = `UPDATE user SET level=2 WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function codeLevelUpDB(data) {
  let sql = `UPDATE code SET level=2 WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function codePrivateYDB(data) {
  let sql = `UPDATE code SET private='Y' WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function codePrivateNDB(data) {
  let sql = `UPDATE code SET private='AN' WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function commentPrivateYDB(data) {
  let sql = `UPDATE comment SET private='Y' WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function commentPrivateNDB(data) {
  let sql = `UPDATE comment SET private='N' WHERE `;
  const leng = data.length
  for (let i = 0; i < leng; i += 1) {
    sql += `idx=${(i === leng - 1) ? "'" + data[i] + "'" : "'" + data[i] + "' OR "}`;
  }
  sql += ` ;`;
  return new Promise((resolve, reject) => {
    userDB.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function goOutDB(userID) {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT level FROM user WHERE userID='${userID}'`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

//관리자 카테고리 관리
export function getTagDB() {
  return new Promise((resolve, reject) => {
    userDB.query(`SELECT * FROM tag`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export function addTagDB(data) {
  const { title, name, color } = data;
  return new Promise((resolve, reject) => {
    userDB.query(`INSERT INTO tag (title, name, color) VALUES ('${title}', '${name}', '${color}') ;`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  });
}

export default userDB;

