
  /**
  * AttackBot v.1.0
  **/

function attackBot() {

    let findTryingCounter = 0;

    let reload = setInterval(() => {
        reloadPage();
    }, 500);

    function reloadPage() {
        let level = getLevel();

        $.ajax({
            url: 'http://nazone.mobi/game/fight/find?level=' + level,
            type: 'GET',
            success: function (res) {
                let body = $('body');
                body.children().remove();
                body.append(res);
                tryAttack();
            }
        });
    }

    function getLevel() {
        let level = getOwnLevel();
        if (findTryingCounter > 60) {
            return level;
        }
        if (findTryingCounter > 30) {
            return level + 1;
        }

        return level + 2;
    }

    function getOwnLevel() {
        return $($($($('.user_stats')[0]).children()[0]).children()[0]).text().match(/\d+/g)[0];
    }

    function getOwnParams() {
        let params = $('.tdc');
        return {
            strength: prepareParam(params[2]),
            protection: prepareParam(params[4]),
            flexibility: prepareParam(params[6]),
            accuracy: prepareParam(params[8])
        }
    }

    function getHisParams() {
        let params = $('.tdc');
        return {
            strength: prepareParam(params[3]),
            protection: prepareParam(params[5]),
            flexibility: prepareParam(params[7]),
            accuracy: prepareParam(params[9])
        }
    }

    function prepareParam(param) {
        return parseInt($(param).text());
    }

    function isPossiblyToAttack() {
        let myParams = getOwnParams(),
            hisParams = getHisParams();
        if (((myParams.strength - hisParams.protection) - (hisParams.strength - myParams.protection)) < 0) {
            return false;
        }

        return !(((myParams.flexibility + myParams.accuracy) - (hisParams.flexibility + hisParams.accuracy)) < -20)
    }

    function getAttackUrl() {
        return $($($($('.center')[1]).children()[0]).children()[0]).attr('href');
    }

    function checkToNextAttack() {
        let time = $($($('.partial_navigation_go_item')[0]).children()[0]).text().substr(27, 20).match(/\d+/g),
            minutes = parseInt(time[0]),
            seconds = parseInt(time[1]),
            millis = minutes * 60000 + seconds * 1000;
        console.log('milliseconds = ' + millis);
        setTimeout(() => {
            attackBot();
        }, millis);
    }

    function attack(url) {
        $.ajax({
            url: 'http://nazone.mobi/' + url,
            type: 'GET',
            success: function (res) {
                let body = $('body');
                body.children().remove();
                body.append(res);
                markNotAttack(getUserId());
                checkToNextAttack();
            }
        });
    }

    function tryAttack() {
        findTryingCounter++;

        if (isPossiblyToAttack() && !hasMark()) {
            clearInterval(reload);
            attack(getAttackUrl());
        }
    }

    function getUserId() {
        return $($($('.user_link')[2]).children()[0]).attr('href').match(/\d+/g)[0];
    }

    function markNotAttack(id) {
        let url = 'http://nazone.mobi/game/relation/add?from_fight=true&id=' + id + '&kind=skip_fight';
        $.ajax({
            url: url,
            type: 'GET'
        });
    }

    function hasMark() {
        return $($($($($('.center')[0]).children()[1]).children()[0]).children()[1]).hasClass('fight_skip');
    }
}

attackBot();
