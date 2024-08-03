const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let posts = [];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const post = req.body;
    console.log('Received new post:', post); // 서버에 게시글이 제대로 도착했는지 확인하기 위한 로그
    posts.unshift(post);
    res.status(201).json(post);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
