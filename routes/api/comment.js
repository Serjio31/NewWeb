const express = require('express');
const router = express.Router();

const models = require('../../models');

// POST is add
router.post('/add', async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    console.log(req.body);

    if (!userId || !userLogin) {
        res.json({
            ok: false
        });
    } else {
        const post = req.body.post;
        const body = req.body.body;
        const parent = req.body.parent;

        try {
            if (!parent) {
                await models.Comment.create({
                    post,
                    body,
                    owner: userId
                });

                res.json({
                    ok: true,
                    body,
                    login: userLogin
                });
            } else {
                const parentComment = await models.Comment.findById(parent);
                if (!parentComment) {
                    res.json({
                        ok: false
                    });
                }

                const comment = await models.Comment.create({
                    post,
                    body,
                    parent,
                    owner: userId
                });

                const children = parentComment.children;
                children.push(comment.id);
                parentComment.children = children;
                await parentComment.save();

                res.json({
                    ok: true,
                    body,
                    login: userLogin
                });
            }
        } catch (error) {
            res.json({
                ok: false
            });
        }
    }
});

// comment is edit
router.put('/edit/:id', async (req, res) => {
    const userId = req.session.userId;
    const userGroup = req.session.group;
    const commentId = req.body.commentId;
    const body = req.body.body;
    const userLogin = req.session.userLogin;

    const comment = await models.Comment.findById(commentId)
        .populate('owner');

    if (userId === comment.owner._id || userGroup === 'Admins') {
        await models.Comment.findByIdAndUpdate(
            commentId,
            {$set: {body}},
            {new: true}
        );
        res.json({
            ok: true,
            body,
            login: userLogin
        });
    } else {
        res.json({
            ok: false
        });
    }

});


module.exports = (app) => app.use('/api/comment', router);