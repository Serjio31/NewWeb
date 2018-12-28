/* eslint-disable no-undef */
$(function () {
    // remove errors
    function removeErrors() {
        $('.post-form p.error').remove();
        $('.post-form input, #post-body').removeClass('error');
    }

    // clear
    $('.post-form input, #post-body').on('focus', function () {
        removeErrors();
    });

    // publish
    $('.publish-button, .save-button').on('click', function (e) {
        e.preventDefault();
        removeErrors();

        var isDraft =
            $(this)
                .attr('class')
                .split(' ')[0] === 'save-button';

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').val(),
            isDraft: isDraft,
            postId: $('#post-id').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/post/add'
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>');
                if (data.fields) {
                    data.fields.forEach(function (item) {
                        $('#post-' + item).addClass('error');
                    });
                }
            } else {
                if (isDraft) {
                    $(location).attr('href', '/api/post/edit/' + data.post.id);
                } else {
                    $(location).attr('href', '/posts/' + data.post.url);
                }
            }
        });
    });

    // upload
    $('#file').on('change', function () {
        // e.preventDefault();

        var formData = new FormData();
        formData.append('postId', $('#post-id').val());
        formData.append('file', $('#file')[0].files[0]);

        $.ajax({
            type: 'POST',
            url: '/api/upload/image',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                $('#fileinfo').prepend(
                    '<div class="img-container"><img src="/uploads' +
                    data.filePath +
                    '" alt="" /></div>' +
                    '<div class="close">x</div>'
                );
            },
            error: function (e) {
                console.log(e);
            }
        });
    });

    // inserting image
    $('.img-container>img').on('click', function () {
        var imageId = $(this.parentElement).attr('id');
        var txt = $('#post-body');
        var caretPos = txt[0].selectionStart;
        var textAreaTxt = txt.val();
        var txtToAdd = '![alt text](image' + imageId + ')';
        txt.val(
            textAreaTxt.substring(0, caretPos) +
            txtToAdd +
            textAreaTxt.substring(caretPos)
        );
    });

    $('.close').on('click', function () {

            const el = this;
            const imageId = $(this.parentElement).attr('id');
            $.ajax({
                type: 'DELETE',
                url: '/api/upload/' + imageId,
                processData: false,
                contentType: false,
                success: function () {
                    $(el).closest(".img-container").remove();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    );


});


/* eslint-enable no-undef */