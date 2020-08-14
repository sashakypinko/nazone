function improveWarehouse(url = null) {
    if (!url) {
        url = "/game/confirm2?back_url=%2Fgame%2Fbusiness&amp;drid=" +
            $('.items .description a').prop('href').substr($('.items .description a').prop('href').indexOf('&drid=') + 6) +
            "&amp;url=%2Fgame%2Fbusiness%2Fwarehouse_improve";
    }
    $.ajax({
        url: url,
        type: 'GET',
        success: function (resp) {
            if ($('.js-wrapper').length <= 0) {
                $('body').append('<div class="js-wrapper"></div>');
            }
            let $jsWrapper = $('.js-wrapper');
            $jsWrapper.html('');
            $jsWrapper.html(resp);

            let lim = $jsWrapper.find('.notifications_block .notice_content').text().indexOf("Недостаточно");
            if (lim >= 0) {
                alert("Деньги закончились(");
                return location.reload();
            } else {
                console.log("Improved successfully!");
            }
            restartScript($jsWrapper);
        }
    });

    function restartScript($jsWrapper) {
        let href = $jsWrapper.find('.items .description a').prop('href'),
            drid = href.substr(href.indexOf('&drid=') + 6),
            url = "/game/confirm2?back_url=%2Fgame%2Fbusiness&amp;drid=" +
                drid + "&amp;url=%2Fgame%2Fbusiness%2Fwarehouse_improve";

        improveWarehouse(url);
    }
}

improveWarehouse();