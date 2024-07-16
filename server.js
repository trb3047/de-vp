//db 연결
import express from 'express';
import userRouter from './routes/uesrRouter.js';

//db 관련
const app = express();

const port = 5000;

//json 형태로 데이터를 받아준다.
app.use(express.json());

//사용할 url scope에 연결
app.use('/api', userRouter);


app.get('/', (req, res) => {
    res.send('<h2>welcem to server</h2>');
});

app.listen(port, () => {
    console.log('server 실행됨 port:' + port);
});
