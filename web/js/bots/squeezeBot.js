function squeezeBot() {
    let findUrl = '/game/mine/find?drid=',
        getAwardUrl = '/game/mine/get_award?drid=',
        foundChips = 0,
        lostChips = 0,
        squeezeCount = getAvailableSqueezeCount();
    function squeeze() {
        $.ajax({
            url: 'http://nazone.mobi' + findUrl + getDrid(),
            type: 'GET',
            success: res => {
                replaceContainer(res);
                trySqueeze();
            }
        });
    }
    function getAward() {
        $.ajax({
            url: 'http://nazone.mobi' + getAwardUrl + getDrid(),
            type: 'GET',
            success: res => {
                replaceContainer(res);
                foundChips += getStolenChipsCount();
                squeezeCount--;
                console.log("Удалось украсть фишек  ---  " + getStolenChipsCount());
                waitNextSqueeze();
            }
        });
    }
    function waitNextSqueeze() {
        if (squeezeCount > 0) {
            console.log('millis to next mine  ---   '+ getRemaindMillis())
            setTimeout(() => {
                trySqueeze(true);
            }, getRemaindMillis());
        } else {
            showResults();
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
            waitNextSqueeze();
        }
    }
    function getPermissionForSqueeze() {
        let luck = getPercentageOfLuck(),
            chipsCount = getStolenChipsCount();
        if (luck >= 40) {
            if (chipsCount >= 4) {
                return false
            }
            return true;
        } else if (luck >= 20) {
            if (chipsCount >= 10) {
                return false
            }
            return true;
        } else {
            if (chipsCount >= 13) {
                return false
            }
            return true;
        }
    }
    function getPercentageOfLuck() {
        let luck = 0;
        $('body').find('.block').each((index, item) => {
            if ($(item).text().match(/пойманным/g)) {
                luck = $($(item).children()[0]).text().match(/\d+/)[0];
            }
        });
        return parseInt(luck);
    }
    function getStolenChipsCount() {
        let count = 0;
        $('body').find('span').each((index, item) => {
            if ($(item).text().match(/фиш/g)) {
                count = $(item).text().match(/\d+/)[0];
            }
        });
        return parseInt(count);
    }
    function getDrid() {
        let drid = '';
        $('body').find('a').each((index, item) => {
            if ($(item).attr('href').match(/drid/g)) {
                drid = $(item).attr('href').split('drid=')[1].match(/\d+/)[0];
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
        return parseInt($($('.remain_seconds')[$('.remain_seconds').length - 1]).text()) * 1000 +2000;
    }
    function getAvailableSqueezeCount() {
        let count = 0;
        $('body').find('a').each((index, item) => {
            if ($(item).text().match(/Шмон /g)) {
                count = $(item).text().split('(')[1].match(/\d+/)[0];
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
            }
        });
        return success;
    }
    trySqueeze(true);
}
squeezeBot();