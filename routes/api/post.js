const express = require('express');
const router = express.Router();
const tr = require('transliter');

const models = require('../../models');

// GET for edit
router.get('/edit/:id', async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const userGroup = req.session.group;
    const id = req.params.id.trim().replace(/ +(?= )/g, '');

    if (!userId || !userLogin) {
        res.redirect('/');
    } else {
        try {
            const post = await models.Post.findById(id).populate('uploads');

            if (!post) {
                const err = new Error('Not Found');
                err.status = 404;
                next(err);
            }

            res.render('post/edit', {
                post,
                user: {
                    id: userId,
                    login: userLogin,
                    group: userGroup
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
});

// GET for add
router.get('/add', async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!userId || !userLogin) {
        res.redirect('/');
    } else {
        try {
            const post = await models.Post.findOne({
                owner: userId,
                status: 'draft'
            });

            if (post) {
                res.redirect(`/api/post/edit/${post.id}`);
            } else {
                const post = await models.Post.create({
                    owner: userId,
                    status: 'draft'
                });
                res.redirect(`/api/post/edit/${post.id}`);
            }
        } catch (error) {
            res.json({
                ok: false,
                error: error
            });
        }
    }
});

// POST is add
router.post('/add', async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const userGroup = req.session.group;

    if (!userId || !userLogin) {
        res.redirect('/');
    } else {
        const title = req.body.title.trim().replace(/ +(?= )/g, '');
        const body = req.body.body.trim();
        const isDraft = !!req.body.isDraft;
        const postId = req.body.postId;
        const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;

        if (!title || !body) {
            const fields = [];
            if (!title) fields.push('title');
            if (!body) fields.push('body');

            res.json({
                ok: false,
                error: 'Все поля должны быть заполнены!',
                fields
            });
        } else if (title.length < 3 || title.length > 64) {
            res.json({
                ok: false,
                error: 'Длина заголовка от 3 до 64 символов!',
                fields: ['title']
            });
        } else if (body.length < 3) {
            res.json({
                ok: false,
                error: 'Текст не менее 3х символов!',
                fields: ['body']
            });
        } else if (!postId) {
            res.json({
                ok: false
            });
        } else {
            try {
                const thisPost = await models.Post.findById(postId).populate('owner');

                const post = await models.Post.findOneAndUpdate(
                    {
                        _id: postId
                    },
                    {
                        title,
                        body,
                        url,
                        owner: thisPost.owner._id,
                        status: isDraft ? 'draft' : 'published'
                    },
                    {new: true}
                );

                if (!post && userGroup != 'Admins') {
                    res.json({
                        ok: false,
                        error: 'Пост не твой!'
                    });
                } else {
                    res.json({
                        ok: true,
                        post
                    });
                }

                ///
            } catch (error) {
                res.json({
                    ok: false
                });
            }
        }
    }
});


module.exports = (app) => app.use('/api/post', router);