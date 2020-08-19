function ratBot() {
    openMainPage();
    let satietyUp = 'a_hunger&category=playable&item=bread&drid=',
        healthUp = 'a_health&category=playable&item=vitamin&drid=',
        toothinessUp = 'a_jaws&category=playable&item=rusk&drid=',
        intellectUp = 'a_intellect&category=playable&item=packet&drid=',
        dodgeUp = 'a_dexterity&category=playable&item=dropper&drid=',
        enduranceUp = 'a_weight&category=playable&item=rope&drid=',
        walk = 'http://nazone.mobi/game/tamagochi/process_patrol?drid=',
        race = 'http://nazone.mobi/game/tamagochi_race_group/apply_race?drid=';
    let walksCount = 0,
        runsCount = 0,
        gamesCount = 0,
        treatedCount = 0,
        fedCount = 0;

    function improveParameters() {
        if (getMoney() >= 500) {
            if (getBodilyParams().healty <= 90 && treatedCount < 2) {
                raiseParameter(prepareUrl(getParamUrl('health')), 1000);
                addLog(' + 10 к здоровью ');
                treatedCount++;
            } else if (getBodilyParams().satiety <= 85 && fedCount < 2) {
                raiseParameter(prepareUrl(getParamUrl('satiety')), 1000);
                addLog(' + 15 к сытости ');
                fedCount++;
            } else if (gamesCount && getLeastParamValue(getMainParams()) < 90 && getBodilyParams().health >= 50) {
                raiseParameter(prepareUrl(getParamUrl(getLeastParamKey(getMainParams()))), 122000);
                gamesCount--;
            } else if (runsCount && getBodilyParams().health >= 50) {
                goRaceOrWalk(race + getDrid(), 3600000);
                addLog('Крыса отправилась на бега и вернется через час');
                runsCount--;
            } else if (walksCount && getBodilyParams().health >= 50) {
                goRaceOrWalk(walk + getDrid() + '&id=' + getId, 3600000);
                addLog('Крыса пошла на прогулку и вернется через час');
                walksCount--;
            } else {
                addLog('Здесь больше нечего делать');
            }
        } else {
            addLog('Недостаточно купонов. Необходимо - 500');
        }
    }

    function raiseParameter(param, timeout) {
        $.ajax({
            url: prepareUrl(param),
            type: 'GET',
            success: res => {
                setTimeout(() => {
                    openMainPage();
                }, timeout);
            }
        });
    }

    function goRaceOrWalk(url, timeout) {
        $.ajax({
            url: url,
            type: 'GET',
            success: res => {
                setTimeout(() => {
                    openMainPage();
                }, timeout);
            }
        });
    }

    function getParamUrl(param) {
        switch (param) {
            case 'toothiness':
                return toothinessUp;
            case 'intellect':
                return intellectUp;
            case 'endurance':
                return enduranceUp;
            case 'dodge':
                return dodgeUp;
            case 'health':
                return healthUp;
            case 'satiety':
                return satietyUp;
        }
    }

    function getLeastParamKey(params) {
        return Object.keys(params).reduce(function (a, b) {
            return params[a] < params[b] ? a : b
        });
    }

    function getLeastParamValue(params) {
        return Math.min(...Object.values(params));
    }

    function getBodilyParams() {
        return {
            health: getParam(1),
            satiety: getParam(2),
        }
    }

    function getMainParams() {
        return {
            toothiness: getParam(3),
            intellect: getParam(4),
            endurance: getParam(5),
            dodge: getParam(6)
        }
    }

    function getParam(item) {
        return parseInt($('.page_game_tamagochi_show_tamagochi ul.items:nth-child(4) li:nth-child(' + item + ') h4 a').text());
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

    function getId() {
        let id = '';
        $('body').find('a').each((index, item) => {
            if ($(item).attr('href').match(/&id=/g)) {
                id = $(item).attr('href').split('&id=')[1].match(/\d+/)[0];
            }
        });
        return id;
    }

    function openMainPage() {
        $.ajax({
            url: 'http://nazone.mobi/game/tamagochi',
            type: 'GET',
            success: res => {
                replaceContainer(res);
                walksCount = getWalksCount();
                runsCount = getRunsCount();
                gamesCount = getGamesCount();

                improveParameters();
            }
        });
    }

    function replaceContainer(data) {
        let body = $('body');
        body.children().remove();
        body.append(data);
    }

    function prepareUrl(url) {
        return 'http://nazone.mobi/game/tamagochi/buy?affected_attr=' + url + getDrid() + '&id=' + getId;
    }

    function getGamesCount() {
        return getActionCount('игр:');
    }

    function getRunsCount() {
        return getActionCount('бегов:');
    }

    function getWalksCount() {
        return getActionCount('прогулок:');
    }

    function getActionCount(action) {
        let count = 0;
        $('body').find('.description li').each((index, item) => {
            if ($(item).text().match(new RegExp(action, 'g'))) {
                count = $(item).text().split(': ')[1];
                return false;
            }
        });
        return parseInt(count);
    }

    function getMoney() {
        let money = 0;
        $('body').find('.money_item a').each((index, item) => {
            if ($(item).attr('href') == '/game/exchange') {
                money = $(item).text().replace(' ', '');
                return false;
            }
        });
        return parseInt(money);
    }

    function addLog(text) {
        console.log('----------------------------------------------');
        console.log(text);
    }
}