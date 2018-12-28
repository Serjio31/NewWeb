/* eslint-disable no-undef */
$(function () {
    var commentForm;
    var parentId;

    function form(isNew, comment) {
        $('.reply').show();

        if (commentForm) {
            commentForm.remove();
        }
        parentId = null;

        commentForm = $('.comment').clone(true, true);

        if (isNew) {
            commentForm.find('.cancel').hide();
            commentForm.appendTo('.comment-list');
        } else {
            var parentComment = $(comment).parent();
            parentId = parentComment.attr('id');
            $(comment).after(commentForm);
        }

        commentForm.css({display: 'flex'});
    }

    function editForm(comment) {
        $('.reply').show();
        $('.edit').show();

        if (commentForm) {
            commentForm.remove();
        }

        commentForm = $('.comment_edit').clone(true, true);

        var comment_body = $(comment).parent().children('.comment-body');

        commentForm.find('textarea').val( comment_body.text());

        parentId = $(comment).parent().attr('id');

        $(comment).after(commentForm);

        commentForm.css({display: 'flex'});
    }

     // load
     form(true);

    // add form
    $('.reply').on('click', function () {
        form(false, this);
        $(this).hide();
    });

    $('.edit').on('click', function () {
        editForm(this);
        $(this).hide();
    });

    // add form
    $('form.comment .cancel').on('click', function (e) {
        e.preventDefault();
        commentForm.remove();
        // load
        form(true);
    });

    // publish
    $('form.comment .send').on('click', function (e) {
        e.preventDefault();
        // removeErrors();

        var data = {
            post: $('.comments').attr('id'),
            body: commentForm.find('textarea').val(),
            parent: parentId
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/comment/add'
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                if (data.error === undefined) {
                    data.error = 'Неизвестная ошибка!';
                }
                $(commentForm).prepend('<p class="error">' + data.error + '</p>');
            } else {
                var newComment =
                    '<ul><li style="background-color:#ffffe0;"><div class="head"><a href="/users/' +
                    data.login +
                    '">' +
                    data.login +
                    '</a><span class="date">Только что</span></div>' +
                    data.body +
                    '<span class="link reply">ответить</span>' +
                    '</li></ul>';

                $(commentForm).after(newComment);
                form(true);
            }
        });
    });

    // edit
    $('form.comment_edit .edit_comment').on('click', function (e) {
        e.preventDefault();
        // removeErrors();

        var data = {
            body: commentForm.find('textarea').val(),
            commentId: parentId
        };

        $.ajax({
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/comment/edit/' + parentId
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                if (data.error === undefined) {
                    data.error = 'Неизвестная ошибка!';
                }
                $(commentForm).prepend('<p class="error">' + data.error + '</p>');
            } else {
                var comment_body = $(commentForm).parent().children('.comment-body');
                comment_body.text(data.body);
                $('.edit').show();
                form(true);
            }
        });
    });





});