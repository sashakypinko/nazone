function squeezeBot() {
    let findUrl = '/game/mine/find?drid=',
        getAwardUrl = '/game/mine/get_award?drid=',
        foundChips = 0,
        lostChips = 0,
        squeezeCount = getAvailableSqueezeCount();

    function squeeze() {
        sendAjax();

        function sendAjax() {
            $.ajax({
                url: 'http://nazone.mobi' + findUrl + getDrid(),
                type: 'GET',
                success: res => {
                    replaceContainer(res);
                    let notifContentText = $('.notifications_block .notice_content').text();
                    let luck = notifContentText.indexOf("Ты совершил одно действие");
                    if (luck >= 0) {
                        return sendAjax();
                    }
                    trySqueeze();
                }
            });
        }
    }

    function trySqueeze(success = false) {
        if (success) {
            squeeze();
        } else if (isSuccess()) {
            $.ajax({
                url: 'http://nazone.mobi/game/mine',
                type: 'GET',
                success: res => {
                    replaceContainer(res);
                    getPermissionForSqueeze() ? squeeze() : getAward();
                }
            });
        } else {
            lostChips += getStolenChipsCount();
            squeezeCount--;
            console.log("Не удалось украсть фишек  ---  " + getStolenChipsCount());
            setTimeout(function () {
                waitNextSqueeze();
            }, 200);
        }
    }

    function getAward() {
        $.ajax({
            url: 'http://nazone.mobi' + getAwardUrl + getDrid(),
            type: 'GET',
            success: res => {
                replaceContainer(res);
                foundChips += getStolenChipsCount(true);
                squeezeCount--;
                console.log("Удалось украсть фишек  ---  " + getStolenChipsCount(true));
                setTimeout(function () {
                    waitNextSqueeze();
                }, 200);
            }
        });
    }

    function waitNextSqueeze() {
        let remaindMillis = getRemaindMillis();
        if (squeezeCount > 0) {
            console.log('millis to next mine  ---   ' + remaindMillis);
            setTimeout(() => {
                trySqueeze(true);
            }, remaindMillis);
        } else {
            showResults();
        }
    }

    function getPermissionForSqueeze() {
        let luck = getPercentageOfLuck(),
            chipsCount = getStolenChipsCount(true);

        if (luck >= 35) {
            return chipsCount < 4;
        } else if (luck >= 20) {
            return chipsCount < 10;
        } else {
            return chipsCount < 13;
        }
    }

    function getPercentageOfLuck() {
        let luck = 0;
        $('body').find('.block').each((index, item) => {
            if ($(item).text().match(/пойманным/g)) {
                luck = $($(item).children()[0]).text().match(/\d+/)[0];
                return false;
            }
        });
        return parseInt(luck);
    }

    function getStolenChipsCount(isSuccess = false) {
        let count = 0,
            spanSelector;

        if (isSuccess) {
            spanSelector = 'span.value:last';
        } else {
            spanSelector = '.notice_content span.value';
        }

        $('body').find(spanSelector).each((index, item) => {
            if ($(item).text().match(/фиш/g)) {
                count = $(item).text().match(/\d+/)[0];
                return false;
            }
        });
        return parseInt(count);
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

    function replaceContainer(data) {
        let body = $('body');
        body.children().remove();
        body.append(data);
    }

    function getRemaindMillis() {
        return parseInt($($('.remain_seconds')[$('.remain_seconds').length - 1]).text()) * 1000 + 2000;
    }

    function getAvailableSqueezeCount() {
        let count = 0;

        $('body').find('.title_sub  a').each((index, item) => {
            if ($(item).prop('href').match(/\/game\/mine/g) && $(item).text().match(/Шмон /g)) {
                count = $(item).text().split('(')[1].match(/\d+/)[0];
                return false;
            }
        });
        return parseInt(count);
    }

    function showResults() {
        console.log('----------------------------------------');
        console.log('Всего украдено --- ' + foundChips);
        console.log('Всего не удалось украсть --- ' + lostChips);
    }

    function isSuccess() {
        let success = false;
        $('body').find('a').each((index, item) => {
            if ($(item).hasClass('button_big')) {
                success = true;
                return false;
            }
        });
        return success;
    }

    trySqueeze(true);
}

squeezeBot();