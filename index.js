var express     = require('express'),
    NodeCache   = require('node-cache'),
    request     = require('request'),
    db          = require('coriolis-data/ships'),
    modules     = require('coriolis-data/modules'),
    Ship        = require('./models/ship'),
    app         = express();

var cache   = new NodeCache({stdTTL: 86400, checkperiod: 86400}),
    sorting = require("./data");

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

/**
 * Sort ships
 * @return {Object}
 */
function sortShips () {
    var sidewinder = new Ship("sidewinder"),
        sorted = {
            sidewinder: sidewinder,
            tree: {}
        };

    for (var i in sorting) {
        if (!sorted.tree[i]) sorted.tree[i] = [];

        for (var j in sorting[i]) {
            if (!sorted.tree[i][j]) sorted.tree[i][j] = {};

            for (var k in sorting[i][j]) {
                sorted.tree[i][j][sorting[i][j][k]] = new Ship(sorting[i][j][k]);
            }
        }
    };

    return sorted;
}

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (request, response){

    response.render('list-ships', {
        ships: sortShips()
    });
});

app.get('/ship/:name', function (request, response){
    var ship = new Ship(request.params.name);

    if (!ship) {
        res.status(500);
        res.send();
        return;
    }

    if (request.xhr) {
        response.render('sidebar', {
            basename:   request.params.name,
            ship:       ship
        });
    } else {
        response.render('list-ships', {
            ships:      sortShips(),
            basename:   request.params.name,
            sidebar:    ship
        });
    }

});

app.listen(process.env.PORT || 3000, function () {
    console.log('server listining on port ' + (process.env.PORT || 3000));
});
