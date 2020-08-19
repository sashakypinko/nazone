let globalDrid;

function mapBot() {
    let position = {row: 0, cell: 0},
        directions = getAllDirections(),
        directionsData = [];

    globalDrid = getDrid();

    directions.each((index, item) => {
        let data = {item: item, directions: getDirectionData(item)};
        data.weight = getDirectionWeight();
        directionsData.push(data);
    });

    function getAllDirections() {
       return $('.quest_map a');
    }

    function getDirectionData(direction) {
        let regex = /cell=(?<cell>\d+).*row=(?<row>\d+)/;
        return $(direction).prop('href').match(regex).groups
    }

    function getDirectionWeight(data) {
        return data.directions.cell + data.directions.row;
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