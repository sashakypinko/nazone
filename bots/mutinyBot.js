let globalDrid;

function mutinyBot() {

    let reload = setInterval(() => {
        reloadPage();
    }, 500);

    function reloadPage() {
        $.ajax({
            url: 'http://nazone.mobi/game/patrol',
            type: 'GET',
            success: function (resp) {
                updatePage(resp);
                tryMutiny();
            }
        });
    }

    function tryMutiny() {
        let timesMutiny = $('.page_game_patrol_index .links_action a[href*="patrol"]');

        if (timesMutiny.length > 0) {
            timesMutiny.each(function () {
                let href = $(this).prop('href'),
                    regex = /\d+[^&drid]/,
                    duration = regex.exec(href);

                clearInterval(reload);
                mutiny(href, duration);
                return false;
            })
        }
    }

    function mutiny(href, duration) {
        $.ajax({
            url: href,
            type: 'GET',
            success: function (resp) {
                updatePage(resp);

                console.log($('.js-mutiny-wrapper').find('.page_game_patrol_index').children('.center').first().find('.block').text());
                console.log("Начат мятеж на " + duration + " секунд");
                setTimeout(() => {
                    mutinyBot();
                }, (duration * 1000) + 1000);
            }
        });
    }
}

function updatePage(resp) {
    if ($('.js-mutiny-wrapper').length <= 0) {
        $('body').append('<div class="js-mutiny-wrapper"></div>');
    }
    let $jsWrapper = $('.js-mutiny-wrapper');
    $jsWrapper.html('');
    $jsWrapper.html(resp);

    function updateDrid($wrapper) {
        globalDrid = $wrapper.find('.hp_bars a:nth-child(4)').prop('href').substr($('.hp_bars a:nth-child(4)').prop('href').indexOf('&drid=') + 6)
    }

    updateDrid($jsWrapper);
}

mutinyBot();