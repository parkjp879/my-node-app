const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../public'))); // public 디렉토리의 올바른 경로 설정

let posts = [];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const post = req.body;
    console.log('Received new post:', post);
    posts.unshift(post);
    res.status(201).json(post);
});

// 모든 요청에 대해 index.html 반환
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html')); // public 디렉토리의 올바른 경로 설정
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
