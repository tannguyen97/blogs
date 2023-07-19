const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    if(type == "CommentCreated"){
        const content = data.content;
        const status = content.includes('orange') ? 'rejected' : 'approved';
        axios.post('http://localhost:4005/events', {
            type: "CommentModerated",
            data: {
                id: data.id,
                post: data.postId,
                status,
                content
            }
        })
    }
});

app.listen(4003, () => {
    console.log('Listening on port 4003');
});

