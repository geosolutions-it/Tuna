var bounds;
var myMap;
var wms;
var wms_continent;
var NameArea;
var idArea;
var posPlus;
var param_filter;
var tuna_map;
var top_continent;
var inputParameters;

//OpenLayers.ProxyHost = "/figis/proxy/cgi-bin/proxy.cgi?url=";
//OpenLayers.Util.alphaHack = function() {return true;} //IE6-ubuntu testing
var myDomain = document.domain;

var MyURLGeo;
if (myDomain.indexOf("192.168.1.106") > -1) {
    MyURLGeo = 'http://192.168.1.106:8484';
} else if ((myDomain.indexOf("82.57.248.227") > -1) || (myDomain.indexOf("localhost") > -1)) {
    MyURLGeo = 'http://82.57.248.227:8484';
} else {
    MyURLGeo = 'http://figis02:8484';
}

MyURLGeo = 'http://localhost:8080';

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    initialize: function (options) {
        this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.handler = new OpenLayers.Handler.Click(this, { 'click': this.trigger }, this.handlerOptions);
    },
    trigger: function (e) {
        var lonlat = myMap.getLonLatFromViewPortPx(e.xy);
        /*" + NameArea + "*/
        // support GetFeatureInfo

        document.getElementById('nodelist').innerHTML = "Loading... please wait...";
        var params = {
            SERVICE: "WMS",
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: myMap.getExtent().toBBOX(),
            X: e.xy.x,
            Y: e.xy.y,
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: 'fifao:TUNA_YEARLY_CATCHES',
            FEATURE_COUNT: 50,
            Layers: 'fifao:TUNA_YEARLY_CATCHES',
            Styles: 'polygon',
            Srs: 'EPSG:4326',
            WIDTH: myMap.size.w,
            HEIGHT: myMap.size.h,
            format: 'image/png',
            //gs_url: MyURLGeo + '/geoserver/ows',
			'viewparams': getViewParams(),
            source: inputParameters
        };
        //OpenLayers.loadURL("/figis/proxy-servlet/proxy", params, this, this.setHTML, this.setHTML);
        OpenLayers.loadURL( MyURLGeo + '/geoserver/ows', params, this, this.setHTML, this.setHTML);
        document.getElementById('brkdwn_nodelist').innerHTML = "Loading... please wait...";
        var brkdwn_params = {
            SERVICE: "WMS",
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: myMap.getExtent().toBBOX(),
            X: e.xy.x,
            Y: e.xy.y,
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: 'fifao:TS_FI_TA_BREAKDOWN',
            FEATURE_COUNT: 50,
            Layers: 'fifao:TS_FI_TA_BREAKDOWN',
            Styles: 'polygon',
            Srs: 'EPSG:4326',
            WIDTH: myMap.size.w,
            HEIGHT: myMap.size.h,
            format: 'image/png',
            gs_url: MyURLGeo + '/geoserver/ows',
            source: inputParameters,
			viewparams: getViewParams(),
            specbrkdwn: true
        };
        OpenLayers.loadURL(MyURLGeo + '/geoserver/ows', brkdwn_params, this, this.setBRKDWNHTML, this.setBRKDWNHTML);
        //OpenLayers.Event.stop(e);
    },
    // sets the HTML provided into the brkdwn_nodelist element
    setHTML: function (response) {
        var text = response.responseText;
        if (text.indexOf("Exception") < 0)
            document.getElementById('nodelist').innerHTML = text;
        else
            document.getElementById('nodelist').innerHTML = "";
    },
    // sets the HTML provided into the brkdwn_nodelist element
    setBRKDWNHTML: function (response) {
        var text = response.responseText;
        if (text.indexOf("Exception") < 0)
            document.getElementById('brkdwn_nodelist').innerHTML = text;
        else
            document.getElementById('brkdwn_nodelist').innerHTML = "";
    }
});

function initMap(paramFile) {
     
 
    inputParameters = paramFile;
    // pink tile avoidance
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    // make OL compute scale according to WMS spec
    OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
    bounds = new OpenLayers.Bounds(-180, -90, 180, 90);
    var options = { controls: [],
        maxExtent: bounds,
        maxResolution: 0.703125,
        numZoomLevels: 10,
        projection: "EPSG:4326",
        units: 'degrees',
        
    };
    
    //myMap = new OpenLayers.Map('mapTunaAtlas', options);
    myMap = new OpenLayers.Map('map', options);


    fao_areas = new OpenLayers.Layer.WMS("FAO Fishing Areas", MyURLGeo + "/geoserver/wms?",{
        layers: 'fifao:FAO_MAJOR,fifao:UN_CONTINENT',
        format: OpenLayers.Util.alphaHack() ? "image/gif" : "image/png",
        tiled: 'true',
        tilesOrigin : "-180.0,-90.0",
        transparent: true
    },{
        singleTile: false,
        buffer: 0,
        isBaseLayer: false,
        wrapDateLine: true,
        ratio: 1
    });
    //tuna_map = new OpenLayers.Layer.WMS("Tuna Atlas", "/figis/proxy-servlet/proxy?gs_url=" + MyURLGeo + "/geoserver/ows&source=" + inputParameters, {
    tuna_map = new OpenLayers.Layer.WMS("Tuna Atlas", "http://localhost:8080/geoserver/wms", {
        layers: 'fifao:TUNA_YEARLY_CATCHES',
        format: OpenLayers.Util.alphaHack() ? "image/gif" : "image/png",
        tiled: 'true',
        tilesOrigin : "-180.0,-90.0",
        transparent: true
    },{
        singleTile: false,
        buffer: 0,
        isBaseLayer: false,
        wrapDateLine: true,
        ratio: 1
    });
    tuna_map_brkdwn = new OpenLayers.Layer.WMS("Tuna Atlas - BreakDown", "/figis/proxy-servlet/proxy?gs_url=" + MyURLGeo + "/geoserver/ows&specbrkdwn=true&source=" + inputParameters,{
        layers: 'fifao:TS_FI_TA_BREAKDWN',
        format: OpenLayers.Util.alphaHack() ? "image/gif" : "image/png",
        tiled: 'true',
        tilesOrigin : "-180.0,-90.0",
        transparent: true
    },{
        singleTile: false,
        buffer: 0,
        isBaseLayer: false,
        wrapDateLine: true,
        ratio: 1
    });
    world_grid = new OpenLayers.Layer.WMS("5x5-deg Grid", MyURLGeo + "/geoserver/wms?",{
        layers: 'fifao:GRID_G5',
        format: OpenLayers.Util.alphaHack() ? "image/gif" : "image/png",
        tiled: 'true',
        tilesOrigin : "-180.0,-90.0",
        transparent: OpenLayers.Util.alphaHack() ? false : true
    },{
        singleTile: false,
        buffer: 0,
        isBaseLayer: OpenLayers.Util.alphaHack() ? true : false,
        wrapDateLine: true,
        ratio: 1
    });
    top_continent = new OpenLayers.Layer.WMS("Continents", MyURLGeo + "/geoserver/gwc/service/wms?",{
        layers: 'fifao:UN_CONTINENT',
        format: OpenLayers.Util.alphaHack() ? "image/gif" : "image/png",
        tiled: 'true',
        tilesOrigin : "-180.0,-90.0",
        transparent: OpenLayers.Util.alphaHack() ? true : false
    },{
        singleTile: false,
        buffer: 0,
        isBaseLayer: OpenLayers.Util.alphaHack() ? false : true,
        wrapDateLine: true,
        ratio: 1
    });
    NameArea = 'FAO_MAJOR';
    idArea = 0;
    posPlus = -1;
    if (OpenLayers.Util.alphaHack()) {
        myMap.addLayers([world_grid, tuna_map, /*tuna_map_brkdwn,*/top_continent]);
    } else {
        myMap.addLayers([top_continent, world_grid, tuna_map, /*tuna_map_brkdwn,*/fao_areas]);
    }
    // build up all controls            
    myMap.addControl(new OpenLayers.Control.PanZoomBar());
    myMap.addControl(new OpenLayers.Control.Navigation());
    //myMap.addControl(new OpenLayers.Control.NavToolbar());
    myMap.addControl(new OpenLayers.Control.ScaleLine());
    myMap.addControl(new OpenLayers.Control.MousePosition());
    myMap.addControl(new OpenLayers.Control.LayerSwitcher());
    myMap.zoomToExtent(bounds);
    // support GetFeatureInfo
    var click = new OpenLayers.Control.Click();
    myMap.addControl(click);
    click.activate();
}
function initPrintMap(paramFile) {
    inputParameters = paramFile;
    var mapDiv = document.getElementById("map");
    var w = mapDiv.style.width;
    w = w.indexOf("px") > 0 ? w.substring(0, w.indexOf("px")) : w;
    var h = mapDiv.style.height;
    h = h.indexOf("px") > 0 ? h.substring(0, h.indexOf("px")) : h;
    // Adding images
    var format = OpenLayers.Util.alphaHack() ? "image%2Fgif" : "image%2Fpng";
    var world_gird_div = document.createElement('div');
    world_gird_div.style.width = mapDiv.style.width;
    world_gird_div.style.height = mapDiv.style.height;
    world_gird_div.style.overflow = 'hidden';
    world_gird_div.style.position = 'absolute';
    world_gird_div.style.zIndex = 0;
    world_gird_div.setAttribute('world_gird_div_id', 'World Grid');
    world_gird_div.innerHTML = '<img style="width: ' + mapDiv.style.width + '; height: ' + mapDiv.style.height + '; position: relative;" class="olTileImage" src="' + MyURLGeo + '/geoserver/wms?LAYERS=fifao%3AGRID_G5&amp;FORMAT=' + format + '&amp;TRANSPARENT=false&amp;TILED=true&amp;TILESORIGIN=-180.0%2C-90.0&amp;SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;STYLES=&amp;EXCEPTIONS=application%2Fvnd.ogc.se_inimage&amp;SRS=EPSG%3A4326&amp;BBOX=-180,-90,180,90&amp;WIDTH=' + w + '&amp;HEIGHT=' + h + '"/>';
    var fao_areas_div = document.createElement('div');
    fao_areas_div.style.width = mapDiv.style.width;
    fao_areas_div.style.height = mapDiv.style.height;
    fao_areas_div.style.overflow = 'hidden';
    fao_areas_div.style.position = 'absolute';
    fao_areas_div.style.zIndex = 1;
    fao_areas_div.setAttribute('fao_areas_div_id', 'All Areas');
    fao_areas_div.innerHTML = '<img style="width: ' + mapDiv.style.width + '; height: ' + mapDiv.style.height + '; position: relative;" class="olTileImage" src="' + MyURLGeo + '/geoserver/wms?LAYERS=fifao%3AFAO_MAJOR&amp;FORMAT=' + format + '&amp;TILED=true&amp;TILESORIGIN=-180.0%2C-90.0&amp;TRANSPARENT=true&amp;SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;STYLES=&amp;EXCEPTIONS=application%2Fvnd.ogc.se_inimage&amp;SRS=EPSG%3A4326&amp;BBOX=-180,-90,180,90&amp;WIDTH=' + w + '&amp;HEIGHT=' + h + '"/>';
    var tuna_map_div = document.createElement('div');
    tuna_map_div.style.width = mapDiv.style.width;
    tuna_map_div.style.height = mapDiv.style.height;
    tuna_map_div.style.overflow = 'hidden';
    tuna_map_div.style.position = 'absolute';
    tuna_map_div.style.zIndex = 2;
    tuna_map_div.setAttribute('tuna_map_div_id', 'Tuna Atlas');
    tuna_map_div.innerHTML = '<img style="width: ' + mapDiv.style.width + '; height: ' + mapDiv.style.height + '; position: relative;" class="olTileImage" src="/figis/proxy-servlet/proxy?gs_url=' + MyURLGeo + '/geoserver/ows&source=' + inputParameters + '&amp;LAYERS=fifao%3ATS_FI_TA&amp;FORMAT=' + format + '&amp;TRANSPARENT=true&amp;TILED=true&amp;TILESORIGIN=-180.0%2C-90.0&amp;SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;STYLES=&amp;EXCEPTIONS=application%2Fvnd.ogc.se_inimage&amp;SRS=EPSG%3A4326&amp;BBOX=-180,-90,180,90&amp;WIDTH=' + w + '&amp;HEIGHT=' + h + '"/>';
    var top_continent_div = document.createElement('div');
    top_continent_div.style.width = mapDiv.style.width;
    top_continent_div.style.height = mapDiv.style.height;
    top_continent_div.style.overflow = 'hidden';
    top_continent_div.style.position = 'absolute';
    top_continent_div.style.zIndex = 3;
    top_continent_div.setAttribute('top_continent_div_id', 'Top Continents');
    top_continent_div.innerHTML = '<img style="width: ' + mapDiv.style.width + '; height: ' + mapDiv.style.height + '; position: relative;" class="olTileImage" src="' + MyURLGeo + '/geoserver/wms?LAYERS=fifao%3AUN_CONTINENT&amp;FORMAT=' + format + '&amp;TRANSPARENT=true&amp;TILED=true&amp;TILESORIGIN=-180.0%2C-90.0&amp;SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;STYLES=&amp;EXCEPTIONS=application%2Fvnd.ogc.se_inimage&amp;SRS=EPSG%3A4326&amp;BBOX=-180,-90,180,90&amp;WIDTH=' + w + '&amp;HEIGHT=' + h + '"/>';
    mapDiv.appendChild(world_gird_div);
    if (!OpenLayers.Util.alphaHack())
        mapDiv.appendChild(fao_areas_div);
    mapDiv.appendChild(tuna_map_div);
    mapDiv.appendChild(top_continent_div);
}
//ByRei_dynDiv.api.alter = function () {
//    // notify OL that we changed the size of the map div
//    myMap.updateSize();
//}

var getViewParams = function(){
			/* viewparams: 'FIC_ITEM:2494,2498;CD_GEAR:802,803,805;YR_TA:1960,1961,1962' */
	var cd_gear =  'CD_GEAR:';
		for(g = 0; g < $('#selectedGearType').children().length; g++) {
			selected = $('#selectedGearType').contents()[g];
			value = $($(selected).contents()[0]).attr('value');
			cd_gear += value + (g < $('#selectedGearType').children().length - 1 ? ',' : '');
		}
	
	var fic_item = 'FIC_ITEM:';
		for(s = 0; s < $('#selectedSpecies').children().length; s++) {
			selected = $('#selectedSpecies').contents()[s];
			value = $($(selected).contents()[0]).attr('value');
			fic_item += value + (s < $('#selectedSpecies').children().length - 1 ? ',' : '');
		}

		yr_start = $('#slider-years').slider("values", 0);
		yr_end   = $('#slider-years').slider("values", 1);
	var yr_ta = 'YR_TA:';
		for(y = 0; y < (yr_end - yr_start); y++) {
			yr_ta += (yr_start + y) + (y < (yr_end - yr_start)-1 ? ',' : '');
		}
	
	var qt_start = $('#vertical-range').slider("values", 0);
	var qt_end   = $('#vertical-range').slider("values", 1);
	var qt_ta = 'QTR_TA:';
		for(var q = 0; q <= (qt_end - qt_start ); q++) {
			qt_ta += (qt_start + q) + (q <= (qt_end - qt_start)-1 ? ',' : '');
		}
	
	var statistic = 'OP:' +  ($('#avg').attr("checked") ? 'avg' : 'sum');
	
	var viewparams =  [cd_gear, fic_item, yr_ta, qt_ta, statistic].join(';');
	
	return viewparams;
};

//MyCode
function init() {
    //var legendDiv = document.getElementById('legendTunaAtlas'); 
    //legendDiv.innerHTML = '<img alt="" src="' + MyURLGeo + '/geoserver/wms?request=GetLegendGraphic&Format=image/png&version=1.1.1&layer=fifao:TS_FI_TA&width=20&height=20">';   

    initMap('');

    for (var i = 2010; i >= 1960; i--) {
        $('#startYear').append("<option value='" + i + "'>" + i + "</option>");
        $('#endYear').append("<option value='" + i + "'>" + i + "</option>"); 
    }

    $("#vertical-range").slider({
        orientation: "vertical",
        range: true,
        min: 1,
        max: 4,
        values: [1, 4],
        slide: function (event, ui) {
            $('#vertical-min').html(ui.values[0]);
            $("#vertical-max").html(ui.values[1]);
        }
    });

    $('#slider-years').slider({
        range: true,
        min: 1960,
        max: 2010,
        values: [2008, 2010],
        slide: function (event, ui) {
            $('#min-year').html(ui.values[0]);
            $('#startYear').val(ui.values[0]);

            $('#max-year').html(ui.values[1]);
            $('#endYear').val(ui.values[1]);
        }
    });

    $('#incr').slider({
        min: 1,
        max: 50,
        value: 5,
        slide: function (event, ui) {
            $('#incr')[0].title = ui.value;
            $('#max-incr').html(ui.value);
        }
    });

    $("#tabs").tabs({
        select: function (event, ui) {
            if (ui.index == 1) {
                $("#vertical-range").slider('disable');
                $('#slider-years').slider('disable');
            } else {
                $("#vertical-range").slider('enable');
                $('#slider-years').slider('enable');
            }
        }
    });

    $('#gearType').change(function () {
        var selection = $('#gearType :selected').text();
		if ($(this).val() >= 0 ) {
			$('#gearType :selected').attr('disabled','disabled');
			if (selection != '') {
				if (selection.length > 15) selection = selection.substring(0, 15) + "...";
				$("<div style='background-color:#87ab3e; margin-top:5px;margin-right:5px;'><span style='color:#ffffff; width:120px;margin-left:5px;' value='"+$(this).val()+"'>" + selection + "</span><a href='#' onclick='removeMe(this, \"gearType\");' style='float:right;'>remove</a></div>").appendTo($('#selectedGearType'));
			}
		}
    });

    $('#species').change(function () {
		var selection = $('#species :selected').text();
		if ($(this).val() >= 0 ) {
			$('#species :selected').attr('disabled','disabled');
			if (selection != '') {
				if (selection.length > 15) selection = selection.substring(0, 15) + "...";
				$("<div style='background-color:#714f99; margin-top:5px;margin-right:5px;'><span style='color:#ffffff; width:120px;margin-left:5px;' value='"+$(this).val()+"'>" + selection + "</span><a href='#' onclick='removeMe(this, \"species\");' style='float:right;'>remove</a></div>").appendTo($('#selectedSpecies'));
			}
		}
    });

    $('#startYear').val('2008');
	
    $('#map-button').click(function () {
		

		if (validateMap()) {
		    tuna_map.mergeNewParams({'viewparams':getViewParams()});
			
			var legendParams = [
				"REQUEST=GetLegendGraphic",
				"LAYER=fifao:TUNA_YEARLY_CATCHES",
				"WIDTH=20",
				"HEIGHT=20",
				"format=image/png",
				"viewparams="+getViewParams()
			];
			
			document.getElementById('legendTunaAtlas').innerHTML = 
				'<img alt="" src="'+MyURLGeo+'/geoserver/wms?'+legendParams.join('&')+'">';
				
			document.getElementById('nodelist').innerHTML = '';
			document.getElementById('brkdwn_nodelist').innerHTML = '';
		}
    });

    $('#print-button').click(function () {
        alert($(this)[0].src);
    });
    
   
// * Desc  : Map Resizable
 $("#map").resizable(); 
}

// ------------------------------------------------------------------------------------------------------------------------
// * Desc      : Performs resizing of the map control, called from OnResize event of the browser.
// ------------------------------------------------------------------------------------------------------------------------

function doResize() {
    try {
     

//        if (myMap != null) {
//            myMap.OnBrowserResize();
//        }
//        else {

            myMap.size.w = GetDynamicMapSize();
            var mapDiv = document.getElementById("map");
            mapDiv.style.width = myMap.size.w + "px";
            //            }
           // alert(myMap.size.w);
       
    }
    catch (Ex) {
    }
}

// ------------------------------------------------------------------------------------------------------------------------
// * Desc      : Determines the size of the browser window to set the map control size corresponding to the updated window
// * size of the browser.
// ------------------------------------------------------------------------------------------------------------------------
function GetDynamicMapSize() {
    var mapWidth = 0;
    var mapHeight = 0;

    var broswerWidth = 0;
    var broswerHeight = 0;

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        broswerWidth = window.innerWidth;
        broswerHeight = window.innerHeight;

        broswerWidth = broswerWidth - 28;
        broswerHeight = broswerHeight - 0;

       // Console.debug(String.format('GetDynamicMapSize| Non-IE - 28. Width={0}. Height={1}', mapWidth, mapHeight));

    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode' 
        broswerWidth = document.documentElement.clientWidth;
        broswerHeight = document.documentElement.clientHeight;

        broswerWidth = broswerWidth - 13;
        broswerHeight = broswerHeight - 0;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        broswerWidth = document.body.clientWidth;
        broswerHeight = document.body.clientHeight;

        broswerWidth = broswerWidth - 13;
        broswerHeight = broswerHeight - 0;
    }

    var mapDiv = document.getElementById("map");

    mapWidth = broswerWidth - document.getElementById('legendTunaAtlas').style.width; ;

    return mapWidth-220;
}

function removeMe(sender, type) {
	var value = $($(sender.parentNode).contents()[0]).attr('value');
	
    $(sender.parentNode).remove();
	
	$('#'+type+' option[value='+value+']').attr('disabled', '');
}

function validateMap() {
    if ($('#avg')[0].checked) {
        if ($('#slider-years').slider("values", 0) == $('#slider-years').slider("values", 1)) {
            alert('Please select at least two years.');
            return false;
        }
    }

    if (($('#selectedGearType').children().length == 0) || ($('#selectedSpecies').children().length == 0)) {
        alert('Please select at least one Gear Type and one Species.');
		return false;
	}
	
	return true;
}