(function(){
    /**
     * Create ShipsData component instance
     */
    ShipsData = function () {
        this.ships = document.querySelectorAll(".ship");
        this.header = document.querySelector("header");
        this.main = document.querySelector(".main");
        this.sidebar = document.querySelector("#sidebar");
        this.loading = document.createElement("div");
        this.input = document.querySelector("input");
        this.ships = document.querySelectorAll(".ship");
        this.cache = {};

        this.loading.innerText = "LOADING";
        this.loading.className = "loading";

        this.initEvents();
        this.initPage();
    }

    /**
     * Send AJAX Request
     *
     * @param {String}              type
     * @param {String}              url
     * @param {Function}            callback
     * @param {Function}            error
     */
    ShipsData.prototype.ajax = function (type, url, callback, error) {
        var self    = this,
            xhr     = new XMLHttpRequest();

        error = error || function(){};

        if (self.cache[url]) {
            callback.call(self, this.cache[url]);
            return;
        }

        xhr.open(type, url);
        xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
        xhr.send(null);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                self.cache[url] = xhr.responseText;
                callback.call(self, self.cache[url]);
            } else {
                error.call(self, xhr.status, xhr.responseText);
            }
        }
    }

    /**
     * Init Events
     */
    ShipsData.prototype.initEvents = function () {
        var self = this,
            callback = function () {
                self.handleClick.apply(self, arguments);
            };

        for (var i = this.ships.length; i--;) {
            this.ships[i].addEventListener("click", callback, true);
        }

        this.sidebar.addEventListener("click", function (event) {
            event.stopImmediatePropagation();
            event.stopPropagation();

            if (event.target.classList.contains('fa-times-circle')) {
                history.pushState(null, null, "/");
                document.body.className = "";
            }
        }, true);

        this.input.addEventListener("keyup", function () {
            self.search.apply(self, arguments);
        }, true);

        document.body.addEventListener("click", function () {
            history.pushState(null, null, "/");
            document.body.className = "";
        })

        window.addEventListener("popstate", function (){
            self.onPopstate.apply(self, arguments);
        });
    };

    /**
     * Init default state
     */
    ShipsData.prototype.initPage = function () {
        if (!this.sidebar.firstChild) return;

        var id      = document.querySelector("#sidebar .title").dataset.title,
            state   = {
                id: id,
                ship: this.sidebar.innerHTML
            };

        history.replaceState(state, id, location.pathname);
    };

    /**
     * handle click events
     * @param  {Event} event
     */
    ShipsData.prototype.handleClick = function (event) {
        var id = event.currentTarget.dataset.id;

        event.stopPropagation();
        event.stopImmediatePropagation();

        while (this.sidebar.firstChild) {
            this.sidebar.removeChild(this.sidebar.firstChild);
        }

        this.sidebar.appendChild(this.loading);
        document.body.className = "open";

        this.ajax("get", "/ship/"+id, function (ship){
            history.pushState({id: id, ship: ship }, id, "/ship/"+id);

            while (this.sidebar.firstChild) {
                this.sidebar.removeChild(this.sidebar.firstChild);
            }

            this.sidebar.innerHTML = ship;
        });
    }

    /**
     * On search
     * @param  {Event} event
     */
    ShipsData.prototype.search = function (event) {
        var ship, first;

        for (var i in this.ships) {
            if (!this.ships.hasOwnProperty(i)) continue;
            ship = this.ships[i];

            if (ship.dataset.name.toLowerCase().search(this.input.value.toLowerCase()) !== -1) {
                if (!first) first = ship;
                ship.classList.remove("toggle");
            } else {
                ship.classList.add("toggle");
            }
        }

        if (first && this.input.value != "") {
            this.main.scrollTop = first.offsetParent.offsetParent.offsetTop + first.offsetTop - this.header.offsetHeight - 40;
            this.main.scrollLeft = first.offsetParent.offsetLeft - 40;
        }
    }

    /**
     * On history PopState
     * @param  {PopStateEvent} popstate
     */
    ShipsData.prototype.onPopstate = function (popstate){
        document.body.className = popstate.state == null ? "" : "open";

        if (popstate.state == null) return;

        while (this.sidebar.firstChild) {
            this.sidebar.removeChild(this.sidebar.firstChild);
        }

        this.sidebar.innerHTML = popstate.state.ship;
    }

    new ShipsData();
})();