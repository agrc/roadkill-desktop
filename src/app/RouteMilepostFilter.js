define([
    'app/config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/text!app/templates/RouteMilepostFilter.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/io-query',

    'esri/tasks/BufferParameters',
    'esri/tasks/GeometryService',
    'esri/geometry/Polyline'
], function (
    config,

    _TemplatedMixin,
    _WidgetBase,

    template,
    array,
    declare,
    ioQuery,

    BufferParameters,
    GeometryService,
    Polyline
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //      widget for filtering the data by a buffered route segment

        templateString: template,
        baseClass: 'route-milepost-filter',

        // gp: esri.tasks.Geoprocessor
        gp: null,

        // routeRequiredTxt: String
        routeRequiredTxt: 'A route is required.',

        // fromRequiredTxt: String
        fromRequiredTxt: 'A from milepost is required',

        // toRequiredTxt: String
        toRequiredTxt: 'A to milepost is required',

        // erMsg: String
        erMsg: 'There was an error with the route/milepost service',

        // noMatchMsg: String
        noMatchMsg: 'No match for that route/milepost combination was found.\nPlease check your inputs and try again.',

        // geo: esri.tasks.GeometryService
        geo: null,

        // Parameters to constructor

        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/RouteMilepostFilter:postCreate', arguments);

            this._wireEvents();
        },
        _wireEvents: function () {
            // summary:
            //    Wires events.
            // tags:
            //    private
            console.log('app/RouteMilepostFilter:_wireEvents', arguments);

            this.connect(this.submitBtn, 'onclick', 'onSubmit');
            this.connect(this.clearBtn, 'onclick', 'onClear');
        },
        onSubmit: function () {
            // summary:
            //      fires when the user clicks on the submit button
            console.log('app/RouteMilepostFilter:onSubmit', arguments);

            this.showLoader();

            if (!this.geo) {
                this.initGP();
            }

            var values = this.getValues();
            var params = {
                f: 'json',
                locations: JSON.stringify([values]),
                outSR: 3857
            };
            if (values) {
                fetch(config.measureToGeometryUrl + '?' + ioQuery.objectToQuery(params), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/plain;charset=UTF-8'
                    }
                })
                .then(this.onRequestComplete.bind(this), this.onRequestError.bind(this));
            } else {
                this.hideLoader();
            }
        },
        initGP: function () {
            // summary:
            //      sets up the geoprocessor object
            console.log('app/RouteMilepostFilter:initGP', arguments);

            this.geo = new GeometryService(config.geometryServiceUrl);

            this.connect(this.geo, 'onBufferComplete', 'onBufferComplete');
        },
        getValues: function () {
            // summary:
            //      gets the form values and validates
            console.log('app/RouteMilepostFilter:getValues', arguments);

            var route = this.route.value;
            var from = this.fromMP.value;
            var to = this.toMP.value;
            if (route.length === 0) {
                alert(this.routeRequiredTxt);
                return null;
            } else if (from.length === 0) {
                alert(this.fromRequiredTxt);
                return null;
            } else if (to.length === 0) {
                alert(this.toRequiredTxt);
                return null;
            }

            // remove any leading zeros that may have been passed
            route = parseInt(route, 10) + '';
            // add the appropriate number of leading zeros
            if (route.length === 2) {
                route = '00' + route;
            } else if (route.length === 3) {
                route = '0' + route;
            } else if (route.length === 1) {
                route = '000' + route;
            }

            return {
                routeId: route + 'PM',
                fromMeasure: from,
                toMeasure: to
            };
        },
        onRequestError: function (error) {
            // summary:
            //      description
            console.log('app/RouteMilepostFilter:onRequestError', arguments);

            this.hideLoader();

            alert(error.message);
        },
        onRequestComplete: function (response) {
            // summary:
            //      description
            console.log('app/RouteMilepostFilter:onRequestComplete', arguments);

            response.json().then(function (data) {
                var location = data.locations[0];
                if (location.status !== 'esriLocatingOK') {
                    this.onRequestError({ message: location.status });

                    return;
                }

                var params = new BufferParameters();
                params.distances = [500];
                params.geometries = [new Polyline({
                    paths: data.locations[0].geometry.paths,
                    spatialReference: { wkid: 3857 }
                })];
                params.unionResults = true;

                this.geo.buffer(params);
            }.bind(this), this.onRequestError.bind(this));
        },
        hideLoader: function () {
            // summary:
            //      hides the loader img and enables the button
            console.log('app/RouteMilepostFilter:hideLoader', arguments);

            config.mapapp.map.hideLoader();
            this.submitBtn.disabled = false;
        },
        showLoader: function () {
            // summary:
            //      shows the loader img and disables the button
            console.log('app/RouteMilepostFilter:showLoader', arguments);

            config.mapapp.map.showLoader();
            this.submitBtn.disabled = true;
        },
        onBufferComplete: function (response) {
            // summary:
            //      callback from geometry service
            // response: esri.Geometry[]
            console.log('app/RouteMilepostFilter:onBufferComplete', arguments);

            this.hideLoader();

            this.onComplete(response[0]);
        },
        onComplete: function (/*bufferGeo*/) {
            // summary:
            //      event for other objects to subscribe to
            // bufferGeo: esri.geometry.Polygon
            console.log('app/RouteMilepostFilter:onComplete', arguments);
        },
        onClear: function () {
            // summary:
            //      event for other objects to subscribe to
            console.log('app/RouteMilepostFilter:onClear', arguments);

            this.route.value = '';
            this.fromMP.value = '';
            this.toMP.value = '';
        }
    });
});
