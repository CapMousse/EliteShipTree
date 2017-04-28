var modulesList = require('coriolis-data/modules');

/**
 * Create a new model of modules
 * @param {String} type type of module
 * @param {String} name category name of module
 */
var Modules = function (type, name) {
    if (!modulesList[type] || !modulesList[type][name]) return false;

    var copy = JSON.parse(JSON.stringify(modulesList[type][name]));

    for (var i in copy) {
        if (copy.hasOwnProperty(i)) {
            this[i] = copy[i];
        }
    }

    this.type = type;
    this.name = name;

    return this;
}

/**
 * Find a module by class ex: 3C, 7E,...
 * @param  {String} className
 * @return {Object}
 */
Modules.prototype.findClass = function (className) {
    className = className.split('');

    for (var i in this) {
        if (!this.hasOwnProperty(i)) continue;
        if (this[i].class == className[0] && this[i].rating == className[1]) 
            return this.getName(i);
    }

    return false;
}

/**
 * Find a module by id
 * @param  {String} id
 * @return {Object}
 */
Modules.prototype.findId = function (id) {
    for (var i in this) {
        if (this[i].id === id) return this.getName(i);
    }

    return false;
}

/**
 * Get a module name
 * @param  {int} index
 * @return {Object}
 */
Modules.prototype.getName = function (index) {
    var names = {
        am:     "Auto Field Maintenance Unit",
        bsg:    "Bi Weave Shield Generator",
        cr:     "Cargo Rack",
        cc:     "Collector Limpet Controllers",
        dc:     "Docking Computer",
        fi:     "Frame Shift Drive Interdictor",
        fs:     "Fuel Scoop",
        ft:     "Internal Fuel Tank",
        fx:     "Fuel Transfer Limpet Controllers",
        hb:     "Hatch Breaker Limpet Controller",
        hr:     "Hull Reinforcement Package",
        pv:     "Planetary Vehicle Hanger",
        psg:    "Pristmatic Shield Generator",
        pc:     "Prospector Limpet Controllers",
        rf:     "Refinery",
        sc:     "Scanner",
        scb:    "Shield Cell Bank",
        sg:     "Shield Generator",
        pp:     "Power Plant",
        t:      "Thrusters",
        fsd:    "Frame Shift Drive",
        ls:     "Life Support",
        pd:     "Power Distributor",
        s:      "Sensors",
        ft:     "Fuel Tank",
        pl:     "Pulse Laser",
        ul:     "Burst Laser",
        bl:     "Beam Laser",
        mc:     "Multi Cannon",
        c:      "Cannon",
        fc:     "Fragment Cannon",
        rg:     "Rail Gun",
        pa:     "Plasma Accelerator",
        mr:     "Missile Rack",
        tp:     "Torpedo Pylon",
        nl:     "Mine Launcher",
        ml:     "Mining Laser",
        cs:     "Cargo Scanner",
        cm:     "Countermeasures",
        ws:     "Frame Shift Wake Scanner",
        kw:     "Kill Warrant Scanner",
        sb:     "Shield Booster",
        pci:    "Business Passenger Cabin",
        pce:    "Economy Passenger Cabin"
    }
    
    this[index].moduleName = names[this.name] || this.name;
    this.getInfos(index);

    return this[index];
}

Modules.prototype.getInfos = function (index) {
    var infos = {
        sc:     {Range: ["rangeLS", "LS"]},
        sg:     {Optimal: ["optmass", "T"], Max: ["maxmass", "T"]},
    }

    if (!infos[this.name]) return;

    this[index].infos = "";

    for (var i in infos[this.name]) {
        if (!infos[this.name][i]) continue;
        this[index].infos += i + ": " + this[index][infos[this.name][i][0]] + "" + infos[this.name][i][1] + " ";
    }
}

module.exports = Modules;