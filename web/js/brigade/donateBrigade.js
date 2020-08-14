function donateScript() {
    let url = "/game/clan/donate_perform",
        data = new FormData(),
        counterLuck = 0,
        money = 1,
        resourceType = prompt('Какой ресурс? ' +
            '- money - купы; ' +
            '- staff2 - фишки; ' +
            '- staff - фишки налом; '),
        counterSavingMoney = 0;

    data.append('authenticity_token', $('input[name=authenticity_token]').val());
    data.append('utf8', "%E2%9C%93");
    data.append('commit', "Закинуть");

    let sendAjax = (luck = false) => {
        if (!luck) {
            if (counterLuck === 18) {
                if (resourceType === 'money') {
                    money = 10000;
                } else {
                    money = 10;
                }
            } else if (counterLuck > 18) {
                money *= 1.2;
            }
        } else {
            console.log("Сэкономил - " + money + ';');

            counterSavingMoney += money;
            money = 1;
            counterLuck = 0;
        }

        if (resourceType !== 'money') {
            data.append('money', 0);
        }
        data.append(resourceType, money);

        counterLuck++;

        $.ajax({
            url: url,
            contentType: false,
            processData: false,
            type: 'POST',
            data: data,
            success: function (resp) {

                if ($('.js-wrapper').length <= 0) {
                    $('body').append('<div class="js-wrapper"></div>');
                }
                let $jsWrapper = $('.js-wrapper');
                $jsWrapper.html('');
                $jsWrapper.html(resp);

                let notifContentText = $jsWrapper.find('.notifications_block .notice_content').text();
                let luck = notifContentText.indexOf("Тебе повезло");
                let lim = notifContentText.indexOf("Ты не можешь закинуть в общак больше");
                let enough = notifContentText.indexOf("недостаточно");

                if (lim < 0 && enough < 0) {
                    console.log("Improved successfully!");
                } else {
                    console.log("Ресурсы закончились, всего сэкономлено:" + counterSavingMoney + ";");
                    return;
                }
                sendAjax(luck > 0 && enough > 0);
            }
        });
    };

    return sendAjax;
}

let funny = donateScript();
funny();