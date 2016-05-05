(function(){
    /**
     * Create ShipsData component instance
     */
    ShipsData = function () {
        this.ships = document.querySelectorAll(".ship");
        this.sidebar = document.querySelector("#sidebar");
        this.cache = {};
        this.loading = document.createElement("div");

        this.loading.innerText = "LOADING";
        this.loading.className = "loading";

        this.initEvents();
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

        if (self.cache[url] && false) {
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
        }, true);

        document.body.addEventListener("click", function () {
            document.body.className = "";
        })
    };

    /**
     * handle click events
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

            while (this.sidebar.firstChild) {
                this.sidebar.removeChild(this.sidebar.firstChild);
            }

            this.sidebar.innerHTML = ship;
        });
    }

    new ShipsData();
})();