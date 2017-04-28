var ships           = require('coriolis-data/ships'),
    internalList    = require('coriolis-data/modules').internal,
    Modules         = require('./modules');

var Ship = function (shipName) {
    if (!ships[shipName]) return false;

    var copy = JSON.parse(JSON.stringify(ships[shipName]));

    for (var i in copy) {
        if (copy.hasOwnProperty(i)) {
            this[i] = copy[i];
        }
    }

    this.retailCost = this.formatPrice(this.retailCost);
    this.insurance = this.formatPrice(ships[shipName].retailCost * 5/100);

    this.computeCargo();
    this.computeFuel();
    this.countHardpoints();
    this.countHardpoints();
    this.getStandard();
    this.getInternals();

    return this;
}

/**
 * Format ship price
 * @param  {String|Int} price
 * @return {String}
 */
Ship.prototype.formatPrice = function (price) {
    price = price.toFixed(0);
    
    return price.replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}

/**
 * Compute ship cargo size
 */
Ship.prototype.computeCargo = function () {
    var internal = this.defaults.internal,
        modules = new Modules("internal", "cr"),
        totalCargo = 0,
        module;

    for (var i = internal.length; i--;) {
        if (!(module = modules.findId(internal[i]))) continue;
        totalCargo += module.cargo;
    }

    this.properties.cargo = totalCargo;
}

/**
 * Compute ship fuel size
 */
Ship.prototype.computeFuel = function () {
    var fuel = this.defaults.standard[this.defaults.standard.length - 1],
        modules = new Modules("standard", "ft"),
        totalFuel = 0,
        module;

    if (!(module = modules.findClass(fuel))) return 0;
    totalFuel += module.fuel;

    this.properties.fuel = totalFuel;
}

/**
 * Count hardpoints
 */
Ship.prototype.countHardpoints = function () {
    var count = {};

    this.slots.hardpoints.forEach(function(x){
        count[x] = (count[x] || 0) + 1;
    });

    this.hardpoints =  {
        huge:       count[4] || 0,
        large:      count[3] || 0,
        medium:     count[2] || 0,
        small:      count[1] || 0,
        utility:    count[0] || 0
    };
}

/**
 * Get standard module list
 */
Ship.prototype.getStandard = function () {
    var powerPlants         = (new Modules("standard", "pp")).findClass(this.defaults.standard[0]),
        fsd                 = (new Modules("standard", "fsd")).findClass(this.defaults.standard[2]),
        thrusters           = (new Modules("standard", "t")).findClass(this.defaults.standard[1]),
        powerDistributor    = (new Modules("standard", "pd")).findClass(this.defaults.standard[4]),
        sensors             = (new Modules("standard", "s")).findClass(this.defaults.standard[5]),
        lifeSupport         = (new Modules("standard", "ls")).findClass(this.defaults.standard[3]),
        fuelTank            = (new Modules("standard", "ft")).findClass(this.defaults.standard[6]);

    this.standard = [{
        class: this.slots.standard[0],
        module: powerPlants,
        infos: "Efficiency: " + powerPlants.eff + " Power: " + powerPlants.pgen + "MW",
    },{
        class: this.slots.standard[1],
        module: thrusters,
        infos: "Optimal: " + thrusters.optmass + "T Max: " + thrusters.maxmass + "T",
    },{
        class: this.slots.standard[2],
        module: fsd,
        infos: "Optimal: " + fsd.optmass + "T Max Fuel: " + fsd.maxfuel + "T",
    },{
        class: this.slots.standard[3],
        module: lifeSupport,
        infos: "Time: " + Math.floor(lifeSupport.time/60) + ":" + Math.floor(lifeSupport.time%60).pad(),
    },{
        class: this.slots.standard[4],
        module: powerDistributor,
        infos: "WEP: " + powerDistributor.wepcap + "<small>MJ</small> / " + powerDistributor.weprate + "<small>MW</small>"
            + "<br>SYS: " + powerDistributor.syscap + "<small>MJ</small> / " + powerDistributor.sysrate + "<small>MW</small>"
            + "<br>ENG: " + powerDistributor.engcap + "<small>MJ</small> / " + powerDistributor.engrate + "<small>MW</small>",
    },{
        class: this.slots.standard[5],
        module: sensors,
        infos: "Range: " + sensors.range + "KM",
    },{
        class: this.slots.standard[6],
        module: fuelTank
    }];
}

/**
 * Get internal list
 */
Ship.prototype.getInternals = function () {
    var internals = [],
        internal,
        modules,
        find;

    for (var i = this.slots.internal.length; i--;) {
        if (this.defaults.internal[i] !== 0) {
            for (var j in internalList) {
                modules = new Modules("internal", j);

                if ((find = modules.findId(this.defaults.internal[i]))) {
                    break;
                }
            }
        }

        internal = {
            class: this.slots.internal[i],
            module: this.defaults.internal[i] ? find : false
        }

        internals.unshift(internal);
    }

    this.internals = internals;
}

module.exports = Ship;