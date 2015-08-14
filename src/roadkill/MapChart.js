define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect',

    'dojox/charting/Chart',
    'dojox/charting/axis2d/Default',
    'dojox/charting/plot2d/Pie',
    'dojox/charting/themes/Claro',
    'dojox/charting/action2d/Tooltip',
    'dojox/charting/action2d/MoveSlice',
    'dojox/charting/action2d/Magnify'

], function (
    declare,
    lang,
    array,
    aspect,

    Chart,
    Default,
    Pie,
    Claro,
    Tooltip,
    MoveSlice,
    Magnify
    ) {
    declare("roadkill.MapChart", null, {

        // parameters to constructor

        // chartDiv: String
        //      The id of the div that the chart will be placed in
        chartDiv: '',
        
        // cLayer: esrx.ClusterLayer
        //      The cluster layer which holds the feature from which we will get the data for our chart
        cLayer: null,
        
        // chart: dojox.charting.Chart2D
        chart: null,
        
        // theme: dojox.charting.theme
        theme: Claro,
        
        constructor: function(params) {
            // summary:
            //      The first function to fire. Sets up the chart.
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            lang.mixin(this, params);
            
            this.buildChart();
            
            this.wireEvents();
        },
        buildChart: function(){
            // summary:
            //      Build the chart
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            this.chart = new Chart(this.chartDiv);
            this.chart.addPlot("default", {type: Pie})
                .setTheme(Claro)
                .addSeries('Species', this.getData());

            // var tip;
            // tip = new Tooltip(this.chart, 'default');
            
            // var slice;
            // slice = new MoveSlice(this.chart, "default", {
            //     scale: 1.01,
            //     shift: 3
            // });
            
            // var magnify;
            // magnify = new Magnify(this.chart, "default", {
            //     scale: 1.15
            // });
            
            this.chart.render();
        },
        getData: function(){
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            var data = {};
            var renderer = ROADKILL.mapapp.legend.layers[0].renderer;
            
            function filterSpecies(name){
                if (array.indexOf(renderer.values, name) !== -1) {
                    return name;
                } else {
                    return renderer.defaultLabel;
                }
            }
            
            function getColor(value){
                var index = array.indexOf(renderer.values, value);
                var color;
                if (index !== -1) {
                    color = renderer.infos[index].symbol.color;
                } else {
                    color = renderer.defaultSymbol.color;
                }
                
                return [color.r, color.g, color.b];
            }
            
            array.forEach(this.cLayer._features, function(f){
                var species = filterSpecies(f.attributes[ROADKILL.fields.SPECIES]);
                if (!data[species]) {
                    data[species] = {y: 1, color: getColor(species)};
                } else {
                    data[species].y += 1;
                }
            });
            
            var arr = [];
            for (var d in data) {
                if (data.hasOwnProperty(d)){
                    arr.push({y: data[d].y, text: d, color: data[d].color, tooltip: data[d].y});
                }
            }
            return arr;
        },
        updateData: function(){
            // summary:
            //      updates the chart data
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            this.chart.updateSeries('Species', this.getData());
            
            this.chart.render();
        },
        wireEvents: function(){
            // summary:
            //      wires the events for this object
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            aspect.after(this.cLayer, "clusterFeatures", lang.hitch(this, 'updateData'));
        }
    });
});
