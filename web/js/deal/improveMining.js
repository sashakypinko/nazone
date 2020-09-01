function improveMining(url = null, type = null, amountLevels = null) {
    if (!type) {
        type = prompt('Введите тип:' +
            '- cigarette ' +
            '- tea ' +
            '- sock ' +
            '- juice ');
    }

    console.clear();

    if (!amountLevels) {
        amountLevels = prompt('Введите количество уровней');
    }

    if (!url) {
        url = "/game/business/improve_business?bs_type=" + type +
            "&amp;count=" + amountLevels + "&amp;drid=" + $('.items .description a').prop('href').substr($('.items .description a').prop('href').indexOf('&drid=') + 6);
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
            }

            console.log("Improved successfully!");
            restartScript($jsWrapper, type);
        }
    });

    function restartScript($jsWrapper, type) {
        let href = $jsWrapper.find('.items .description a').prop('href'),
            drid = href.substr(href.indexOf('&drid=') + 6),
            url = "/game/business/improve_business?bs_type=" + type + "&amp;count=" + amountLevels + "&amp;drid=" + drid;

        improveMining(url, type, amountLevels);
    }
}

improveMining();