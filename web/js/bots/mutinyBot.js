let globalDrid;

function mutinyBot() {
    let reload = setInterval(() => {
        reloadPage();
    }, 2000);

    console.clear();

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

                mutiny(href, duration);
                clearInterval(reload);
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
                    reloadPage();
                }, (duration * 1000) + 2000);
            }
        });
    }
}

function getDrid() {
    let drid = '';
    $('body').find('a').each((index, item) => {
        if ($(item).attr('href').match(/drid/g)) {
            drid = $(item).attr('href').split('drid=')[1].match(/\d+/)[0];
            return false;
        }
    });
    return drid;
}

function updatePage(resp) {
    if ($('.js-mutiny-wrapper').length <= 0) {
        $('body').append('<div class="js-mutiny-wrapper"></div>');
    }
    let $jsWrapper = $('.js-mutiny-wrapper');
    $jsWrapper.html('');
    $jsWrapper.html(resp);

    function updateDrid($wrapper) {
        globalDrid = getDrid();
    }

    updateDrid($jsWrapper);
}

mutinyBot();