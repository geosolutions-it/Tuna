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
if (myDomain.indexOf("localhost") > -1) {
    MyURLGeo = 'http://localhost:8080';
} else if ((myDomain.indexOf("82.57.248.227") > -1) || (myDomain.indexOf("localhost") > -1)) {
    MyURLGeo = 'http://82.57.248.227:8484';
} else {
    MyURLGeo = 'http://figis02:8484';
}

// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;


Ext.onReady(function() {			
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

        document.getElementById('nodelist').innerHTML = "Loading... please wait... <img src=\"images/grid-loading.gif\">";
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
        document.getElementById('brkdwn_nodelist').innerHTML = "Loading... please wait...  <img src=\"images/grid-loading.gif\">";
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
	bounds = new OpenLayers.Bounds(-180, -90, 180, 90);
    var options = { controls: [],
        maxExtent: bounds,
        maxResolution: 0.703125,
        numZoomLevels: 10,
        projection: "EPSG:4326",
        units: 'degrees'        
    };
	
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
    world_grid = new OpenLayers.Layer.WMS("5x5-deg Grid", MyURLGeo + "/geoserver/gwc/service/wms?",{
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
	myMap.addControl(new OpenLayers.Control.LoadingPanel());		
    myMap.addControl(new OpenLayers.Control.PanZoomBar());
    myMap.addControl(new OpenLayers.Control.Navigation());
    //myMap.addControl(new OpenLayers.Control.NavToolbar());
    myMap.addControl(new OpenLayers.Control.ScaleLine());
    myMap.addControl(new OpenLayers.Control.MousePosition());
    myMap.addControl(new OpenLayers.Control.LayerSwitcher());	
	
    myMap.zoomToMaxExtent();
    // support GetFeatureInfo
    var click = new OpenLayers.Control.Click();
    myMap.addControl(click);
    click.activate();	
	
	var panel = new Ext.Panel({
		id:'main-panel',
		baseCls:'x-plain',
		renderTo: Ext.getBody(),
		layout:'table',
		layoutConfig: {columns:2},
		width : 800,
		// applied to child components
		defaults: {frame:false, header: false},
		items:[{
			colspan : 2,
			border: false,
			html : [
			/*
				'<table border="0" cellpadding="0" cellspacing="0" width="100%">',
				'<tr>',
				'<td colspan="4">',
				'<table border="0" width="100%">',
				'<tr>',
				'<td align=left style="vertical-align:top;"><a href="http://www.fao.org" target=_blank><img style="VERTICAL-ALIGN: middle" title="FOOD AND AGRICULTURE ORGANIZATION OF THE UNITED NATIONS" border=0 alt="FOOD AND AGRICULTURE ORGANIZATION OF THE UNITED NATIONS" src="http://www.fao.org/figis/geoserver/factsheets/img/FIGIS_banner-logo.gif"></a></td>',
				'<td align=right style="vertical-align:bottom;padding-top:10px;"><a href="http://www.fao.org/fishery" target=_blank>',
				'<img style="VERTICAL-ALIGN: middle" title="FAO Fisheries and Aquaculture Department" border=0 alt="FAO Fisheries and Aquaculture Department" src="http://www.fao.org/figis/geoserver/factsheets/img/FIGIS_banner-text.gif"></a>',
				'</td>',
				'</tr>',
				'</table>',
			*/
				'<table border="0" cellpadding="0" cellspacing="0" width="100%">',
				'<tr>',
				'<td colspan="4">',
				'<img align="middle" src="http://www.fao.org/fi/figis/selector/assets/images/query.gif">',
				'<span class="headtext">Atlas of Tuna and Billfish Catches: Interactive display</span>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td colspan="4" class="smalltext">',
				'<div style="width:660px; text-align:justify;">',
				'To define your Query, select items of interest from the Selection Tabs, define your Display Options and click the Submit button to see results. Due to the amount of data, it may take some time to obtain result, please be patient.	 For background information, please <a href="http://www.fao.org/figis/servlet/static?dom=collection&xml=tunabillfishatlas.xml">read here</a>. User can also download the full set of data used to prepare the maps for <a href="ftp://ftp.fao.org//fi/document/tunatlas/llcatch.zip">Longline</a>, <a href="ftp://ftp.fao.org//fi/document/tunatlas/plcatch.zip">Pole & Line</a> and <a href="ftp://ftp.fao.org//fi/document/tunatlas/pscatch.zip">Purse Seine</a>.',
				'</div>',
				'</td>',
				'</tr>',
				'</table>'
			].join('')
		},
		new GeoExt.MapPanel({
			//title: "GeoExt MapPanel",
			stateId: "mappanel",
			height: 350,
			width: 700,
			map: myMap,
			border: true
		}), {
			layout:'vbox',
			border : false,
			layoutConfig: {
				padding:'5',
				align:'middle',
				border: false
			},
			//title:'Item 2',
			width: 40,
			height: 350,
			items : [
				new Ext.Button({
					text : 'Q+',
					handler: function(){
						var quarters = Ext.getCmp('quarter-slider');	
						var qt_start = quarters.getValues()[0];
						var qt_end = quarters.getValues()[1];
						
						quarters.setValue(0, qt_start+1);
						quarters.setValue(1, qt_end+1);
					}
				}),
				new Ext.slider.MultiSlider({
					//renderTo : 'multi-slider-vertical',
					id : 'quarter-slider',
					vertical : true,
					height   : 240,
					minValue: 1,
					maxValue: 4,
					values  : [1, 4],
					plugins : new Ext.slider.Tip({
						getText: function(thumb){
							return String.format('<b>{0}Q</b>', thumb.value);
						}
					}),
					listeners: {
						changecomplete : function (){
							if (validateSelection()) {
								issueUpdate();
							}
						}
					}
				}),
				new Ext.Button({
					text : 'Q-',
					handler: function(){
						var quarters = Ext.getCmp('quarter-slider');	
						var qt_start = quarters.getValues()[0];
						var qt_end = quarters.getValues()[1];
						
						quarters.setValue(0, qt_start-1);
						quarters.setValue(1, qt_end-1);
					}
				})
			]
		}, {
			//title:'Item 4',
			height:40,
			colspan:2, 
			layout:'hbox',
			border : false,
			layoutConfig: {
				border: false
			},
			items : [
				new Ext.Button({
					text : '--',
					handler: function(){
						var years = Ext.getCmp('years-slider');	
						var yr_start = years.getValues()[0];
						var yr_end = years.getValues()[1];
						
						years.setValue(0, yr_start-10);
						years.setValue(1, yr_end-10);
						
						Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
						Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
					}
				}),
				new Ext.Button({
					text : '-',
					handler: function(){
						var years = Ext.getCmp('years-slider');	
						var yr_start = years.getValues()[0];
						var yr_end = years.getValues()[1];
						
						years.setValue(0, yr_start-1);
						years.setValue(1, yr_end-1);
						
						Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
						Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
					}
				}), {
					id : 'years-min-field',
					xtype: 'textfield',
					readOnly: true,
					width: 40,
					value: 2010
				},
				new Ext.slider.MultiSlider({
					//renderTo : 'multi-slider-vertical',
					id : 'years-slider',
					vertical : false,
					width   : 570,
					minValue: 1970,
					maxValue: 2011,
					values  : [2010, 2011],
					plugins : new Ext.slider.Tip({
						getText: function(thumb){
							return String.format('<b>{0}</b>', thumb.value);
						}
					}),
					listeners: {
						changecomplete : function (){
							if (validateSelection()) {
								issueUpdate();
							}
							Ext.getCmp('years-min-field').setValue(this.getValues()[0]);
							Ext.getCmp('years-max-field').setValue(this.getValues()[1]);
						}
					}
				}),{
					id : 'years-max-field',
					xtype: 'textfield',
					readOnly: true,
					width: 40,
					value: 2011
				},
				new Ext.Button({
					text : '+',
					handler: function(){
						var years = Ext.getCmp('years-slider');	
						var yr_start = years.getValues()[0];
						var yr_end = years.getValues()[1];
						
						years.setValue(0, yr_start+1);
						years.setValue(1, yr_end+1);
						
						Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
						Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
						
					}
				}),				
				new Ext.Button({
					text : '++',
					handler: function(){
						var years = Ext.getCmp('years-slider');	
						var yr_start = years.getValues()[0];
						var yr_end = years.getValues()[1];
						
						years.setValue(0, yr_start+10);
						years.setValue(1, yr_end+10);
						
						Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
						Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
					}
				})
			]
		}, {
			//title:'Item 4',
			height:150,
			autoScroll: 'auto',
			colspan:2, 
			border: false,
			html : ['<table  class="gfi" border="0" cellpadding="0" cellspacing="0" style="width:600px;">',
				'<tr>',
				'<td style="width:200px;"><b>Statistic Operation</b></td>',
				'<td style="width:200px;">',
				'<select id="gearType" style="width:182px;">',
				'<option value="-1">Gear Types</option>',
				'<option value="801">Longline</option>',
				'<option value="802">Pole and line</option>',
				'<option value="803">Purse seine</option>',
				'<option value="805">Other gears</option>',
				'</select>',
				'</td>',
				'<td style="width:210px;">',
				'<select id="species" style="width:182px;">',
				'<option value="-1">Species</option>',
				'<option value="2496">Albacore</option>',
				'<option value="3296">Atlantic bluefin tuna</option>',
				'<option value="3305">Atlantic white marlin</option>',
				'<option value="2498">Bigeye tuna</option>',
				'<option value="2500">Black marlin</option>',
				'<option value="3303">Blue marlin</option>',
				'<option value="18734">Pacific bluefin tuna</option>',
				'<option value="2494">Skipjack tuna</option>',
				'<option value="3298">Southern bluefin tuna</option>',
				'<option value="2501">Striped marlin</option>',
				'<option value="2503">Swordfish</option>',
				'<option value="2497">Yellowfin tuna</option>',
				'</select>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td style="vertical-align:top;">',
				'<input type="radio" name="statistics" id="sum" checked="checked" /><label for="sum">SUM</label><br />',
				'<input type="radio" name="statistics" id="avg" /><label for="avg">AVG</label>',
				'</td>',
				'<td style="vertical-align:top;">',
				'<div id="selectedGearType"></div>',
				'</td>',
				'<td style="vertical-align:top;">',
				'<div id="selectedSpecies"></div>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td colspan="3" align="right" style="padding-top:5px;">',
				'<img id="map-button" title="Redraw map" border="0" src="http://www.fao.org/fi/figis/selector/assets/images/_tabMapThis.gif">',
				'<a href="Print.html" target="_blank"><img id="print-button" title="Print this map" border="0" src="http://www.fao.org/fi/figis/selector/assets/images/_tabMapPrint.gif"></a>',
				'<!--<input id="map-button" title="Redraw map" type="image" src="images/Map.gif" alt="Map" />-->',
				'<!--<input id="print-button" title="Print this map" type="image" src="images/Print.gif" alt="Print" />-->',
				'</td>',
				'</tr>',
				'</table>'].join('')
		}, {
			width: 700,
			colspan : 2,
			border: true,
			html : [
				'<table class="gfi" border="0" cellpadding="0" cellspacing="0">',
				'<tr>',
				'<td style="vertical-align: top;"><i>Click on the map to get cell info</i></td>',
				'</tr>',
				'<tr>',
				'<td><b><i>Query Results</i></b></td>',
				'</tr>',
				'<tr>',
				'<td>',
				'<div id="nodelist"></div>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td>',
				'<b><i>Species Composition</i></b>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td>',
				'<div id="brkdwn_nodelist"></div>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td>',
				'<b>Catches(tonnes)</b>',
				'</td>',
				'</tr>',
				'<tr>',
				'<td>',
				'<div id="legendTunaAtlas">',
				'</div>',
				'</td>',
				'</tr>',
				'</table>'
			].join('')
		}, {
			width: 700,
			colspan : 2,
			border:false,
			html : [
				'<table class="reftopmenu" cellpadding="0" cellspacing="0">',
				'<tr valign="middle" align="left"><td>',
				'<br>',
				'<u>FIELDS DESCRIPTION</u>',
				'<br>',
				'<b>Ocean area</b>',
				'Code of location of catches is made up of six digits {9-Quadrant 99-Latitude 999-Longitude}, where Quadrant {1=NE, 2=SE, 3=SW and 4=NW}.',
				'<br><b>Year.Quarter</b>',
				'breakdown of catches in tonnes by years and quarters (i.e. 2001.Q1 = 1st Quarter 2001).',
				'<br><b>SUM(Year.Quarter)</b>, or <b>AVG(Year.Quarter)</b>',
				'cumulative catches or average catches for selected years and quarters. <br></td></tr></table>'
			].join('')
		}
		]
	});
	
	$('#gearType').change(function () {
        var selection = $('#gearType :selected').text();
		if ($(this).val() >= 0 ) {
			$('#gearType :selected').attr('disabled','disabled');
			if (selection != '') {
				if (selection.length > 15) selection = selection.substring(0, 15) + "...";
					$("<div style='background-color:#33cc99; margin-top:5px;margin-right:5px;'>" +
					"<table style='font-size:12px;' border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"95%\"><tr><td>" +
					"<span style='color:#ffffff; width:120px;margin-left:5px;' value='"+$(this).val()+"'>" + selection + 
					"</span></td><td><a href='#' onclick='removeMe(this, \"gearType\");' style='float:right;display:block;width:60px;'>remove</a></td></tr></table></div>").appendTo($('#selectedGearType'));
			}
		}
    });

    $('#species').change(function () {
		var selection = $('#species :selected').text();
		if ($(this).val() >= 0 ) {
			$('#species :selected').attr('disabled','disabled');
			if (selection != '') {
				if (selection.length > 15) selection = selection.substring(0, 15) + "...";
					$("<div style='background-color:#3399cc; margin-top:5px;margin-right:5px;'>" +
					"<table style='font-size:12px;' border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td>" +
					"<span style='color:#ffffff; width:120px;margin-left:5px;' value='"+$(this).val()+"'>" + selection + 
					"</span></td><td><a href='#' onclick='removeMe(this, \"species\");' style='float:right;display:block;width:60px;'>remove</a></td></tr></table></div>").appendTo($('#selectedSpecies'));				
			}
		}
    });
	
	var getViewParams = function(){
		/* viewparams: 'FIC_ITEM:2494,2498;CD_GEAR:802,803,805;YR_TA:1960,1961,1962' */
		var cd_gear =  'CD_GEAR:';
			/*for(g = 0; g < $('#selectedGearType').children().length; g++) {
				selected = $('#selectedGearType').contents()[g];
				value = $($(selected).contents()[0]).attr('value');
				cd_gear += value + (g < $('#selectedGearType').children().length - 1 ? ',' : '');
			}
			*/
		for(g = 0; g < $('#selectedGearType').find('tr').length; g++) {
			var selected = $($('#selectedGearType').find('tr')[g]).contents()[0];
			var value = $($(selected).contents()[0]).attr('value');
			cd_gear += value + (g < $('#selectedGearType').find('tr').length - 1 ? ',' : '');
		}
					
		
		var fic_item = 'FIC_ITEM:';
		/*
			for(s = 0; s < $('#selectedSpecies').children().length; s++) {
				selected = $('#selectedSpecies').contents()[s];
				value = $($(selected).contents()[0]).attr('value');
				fic_item += value + (s < $('#selectedSpecies').children().length - 1 ? ',' : '');
			}
		*/
		for(g = 0; g < $('#selectedSpecies').find('tr').length; g++) {
			var selected = $($('#selectedSpecies').find('tr')[g]).contents()[0];
			var value = $($(selected).contents()[0]).attr('value');
			fic_item += value + (g < $('#selectedSpecies').find('tr').length - 1 ? ',' : '');
		}		
		
		//yr_start = $('#slider-years').slider("values", 0);
		//yr_end   = $('#slider-years').slider("values", 1);
		
		var years = Ext.getCmp('years-slider');	
		var yr_start = years.getValues()[0];
		var yr_end = years.getValues()[1];
		
		var yr_ta = 'YR_TA:';
			
		for(y = 0; y < (yr_end - yr_start); y++) {
			yr_ta += (yr_start + y) + (y < (yr_end - yr_start)-1 ? ',' : '');
		}
			
		
		//var qt_start = $('#vertical-range').slider("values", 0);
		//var qt_end   = $('#vertical-range').slider("values", 1);
		
		var quarters = Ext.getCmp('quarter-slider');	
		var qt_start = quarters.getValues()[0];
		var qt_end = quarters.getValues()[1];
		
		var qt_ta = 'QTR_TA:';
		
		for(var q = 0; q <= (qt_end - qt_start ); q++) {
			qt_ta += (qt_start + q) + (q <= (qt_end - qt_start)-1 ? ',' : '');
		}
		
		
		var statistic = 'OP:' +  ($('#avg').attr("checked") ? 'avg' : 'sum');
		
		var viewparams =  [cd_gear, fic_item, yr_ta, qt_ta, statistic].join(';');
		
		return viewparams;
};

    $('#map-button').click(function () {		
		if (validateMap()) {
			issueUpdate();
		}
    });

	
	function issueUpdate(){
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

	function validateMap() {
		if ($('#avg')[0].checked) {
			var years = Ext.getCmp('years-slider');
			if (years.getValues()[0] == years.getValues()[1]) {
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

	function validateSelection() {

		if ($('#selectedGearType').find('tr').length == 0 || $('#selectedSpecies').find('tr').length == 0) {
			return false;
		}
	
		return true;
	}	
	
	function removeMe(sender, type) {
	//var value = $($(sender.parentNode).contents()[0]).attr('value');
	var value = $(sender.parentNode.parentNode).find('span').attr('value')
	//:)
    $(sender.parentNode.parentNode.parentNode.parentNode).remove();
	
	$('#'+type+' option[value='+value+']').attr('disabled', '');
}