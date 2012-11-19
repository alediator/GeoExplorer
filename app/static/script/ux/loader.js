(function() {

    var jsfiles = new Array(
        "../../externals/openlayers/lib/OpenLayers/Format/WFSCapabilities.js",
        "../../externals/openlayers/lib/OpenLayers/Format/WFSCapabilities/v1.js",
        "../../externals/openlayers/lib/OpenLayers/Format/WFSCapabilities/v1_1_0.js",
        "../../externals/openlayers/lib/OpenLayers/Strategy.js",
        "../../externals/openlayers/lib/OpenLayers/Strategy/Save.js",
        "../../externals/openlayers/lib/OpenLayers/Strategy/Fixed.js",
        "GeoExt/data/WFSCapabilitiesReader.js",
        "GeoExt/data/WFSCapabilitiesStore.js",
        "widgets/AddLayers.js",
        "widgets/WfsWizard.js",
        "persistenceGeo.js"
    );
    
    var scripts = document.getElementsByTagName("script");
    var parts = scripts[scripts.length-1].src.split("/");
    parts.pop();
    var path = parts.join("/");

    var len = jsfiles.length;
    var pieces = new Array(len);

    for (var i=0; i<len; i++) {
        pieces[i] = "<script src='" + path + "/" + jsfiles[i] + "'></script>"; 
    }
    document.write(pieces.join(""));

})();

