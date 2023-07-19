const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments',(req, res) => {
    res.send(commentsByPostId[req.params.id]);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    
    comments.push({id: commentId, content, status: 'spending'});
    commentsByPostId[req.params.id] = comments;
    
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'spending'
        }
    })
    
    res.status(201).send(comments);

});

app.post('/events', async (req, res) => {
    console.log('Recived enven', req.body.type);
    const { type, data } = req.body;
    if(type === 'CommentModerated'){
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const commment = comments.find(comment => comment.id == id);
        commment.status = status;

        await axios.post('http://localhost:4005', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        })
    }
    res.send({});
})

app.listen(4001,(req, res) => {
    console.log('Listening on port 4001');
});
