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

var selectedGears = [];
var selectedSpecies = [];

// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

Ext.onReady( function() {			
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
                'viewparams': getViewParams(),
                source: inputParameters
            };
            OpenLayers.loadURL( Tuna.vars.geoserverURL + '/ows', params, this, this.setHTML, this.setHTML);
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
                gs_url: Tuna.vars.geoserverURL + '/ows',
                source: inputParameters,
                viewparams: getViewParams(),
                specbrkdwn: true
            };
            OpenLayers.loadURL(Tuna.vars.geoserverURL + '/ows', brkdwn_params, this, this.setBRKDWNHTML, this.setBRKDWNHTML);
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
	  
    var options = { 
        controls: [],
        maxExtent: bounds,
        maxResolution: 0.703125,
        numZoomLevels: 10,
        projection: "EPSG:4326",
        units: 'degrees'        
    };
	
	  myMap = new OpenLayers.Map('map', options);

    fao_areas = new OpenLayers.Layer.WMS("FAO Fishing Areas", Tuna.vars.wms,
        {
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
        }
    );
    
    tuna_map = new OpenLayers.Layer.WMS("Tuna Atlas", Tuna.vars.wms, 
        {
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
        }
    );
    
    world_grid = new OpenLayers.Layer.WMS("5x5-deg Grid", Tuna.vars.gwc,
        {
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
        }
    );
    
    top_continent = new OpenLayers.Layer.WMS("Continents", Tuna.vars.gwc,
        {
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
        }
    );
    
    NameArea = 'FAO_MAJOR';
    idArea = 0;
    posPlus = -1;
    
    if (OpenLayers.Util.alphaHack()) {
        myMap.addLayers([world_grid, tuna_map, top_continent]);
    } else {
        myMap.addLayers([top_continent, world_grid, tuna_map, fao_areas]);
    }
    
    //
    // build up all controls            
	  //
	  myMap.addControl(new OpenLayers.Control.LoadingPanel());		
    myMap.addControl(new OpenLayers.Control.PanZoomBar());
    myMap.addControl(new OpenLayers.Control.Navigation());
    myMap.addControl(new OpenLayers.Control.ScaleLine());
    myMap.addControl(new OpenLayers.Control.MousePosition());
    myMap.addControl(new OpenLayers.Control.LayerSwitcher());	
	
    myMap.zoomToMaxExtent();
    
    //
    // support GetFeatureInfo
    //
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
        items:[
            {
              colspan : 2,
              border: false,
              html : [
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
            {
              xtype: 'panel',
              header: false, 
              autoScroll: true,
              width: 730,
              colspan : 2,
              border: true,
              html: [
                  '<table class="reftopmenu" border="0" cellpadding="2" cellspacing="2" width="100%"><tbody>',
                  '<tr>',
                  '<td align="left" nowrap="nowrap" width="5%"><b>Map Title:</b>',
                  '</td>',
                  '<td id="tabtitle" align="left" width="95%">',
                  '</td>',
                  '</tr>',
                  '<tr>',
                  '<td align="left" width="5%"><b>Species:</b>',
                  '</td>',
                  '<td id="tabspecies" align="left" width="95%">',
                  '</td>',
                  '</tr>',
                  '<tr>',
                  '<td align="left" width="5%"><b>Gears:</b>',
                  '</td>',
                  '<td id="tabgears" align="left" width="95%">',
                  '</td>',
                  '</tr>',
                  '<tr>',
                  '<td align="left" width="5%"><b>Periods:</b>',
                  '</td>',
                  '<td id="tabperiod" align="left" width="95%">',							
                  '</td>',
                  '</tr>',
                  '<tr>',
                  '<td align="left" width="5%"><b>Quarters:</b>',
                  '</td>',
                  '<td id="tabquarters" align="left" width="95%">',							
                  '</td>',
                  '</tr>',
                  '<tr>',
                  '<td colspan="2">',
                  '</td>',
                  '</tr></tbody>',
                  '</table>'
              ].join('')
            },
            new GeoExt.MapPanel({
                stateId: "mappanel",
                height: 350,
                width: 700,
                map: myMap,
                border: true
            }),
            {
                layout:'vbox',
                border : false,
                layoutConfig: {
                  padding:'5',
                  align:'middle',
                  border: false
                },
                width: 40,
                height: 350,
                items: [
                    new Ext.Button({
                        tooltip: "Year quarter increment",
                        tooltipType: 'title',
                        iconCls: "quarter-max-button",
                        handler: function(){
                            var quarters = Ext.getCmp('quarter-slider');	
                            var qt_start = quarters.getValues()[0];
                            var qt_end = quarters.getValues()[1];
                
                            quarters.setValue(0, qt_start+1);
                            quarters.setValue(1, qt_end+1);
                            
                            Ext.getCmp('quarter-min-field').setValue(quarters.getValues()[0]);
                            Ext.getCmp('quarter-max-field').setValue(quarters.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    }),
                    {
                        id : 'quarter-max-field',
                        xtype: 'textfield',
                        readOnly: true,
                        width: 22,
                        value: 4
                    },
                    new Ext.slider.MultiSlider({
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
                            
                            Ext.getCmp('quarter-min-field').setValue(this.getValues()[0]);
                            Ext.getCmp('quarter-max-field').setValue(this.getValues()[1]);
                          }
                        }
                    }), 
                    {
                        id : 'quarter-min-field',
                        xtype: 'textfield',
                        readOnly: true,
                        width: 22,
                        value: 1
                    },
                    new Ext.Button({
                        tooltip: "Year quarter decrement",
                        tooltipType: 'title',
                        iconCls: "quarter-min-button",
                        handler: function(){
                            var quarters = Ext.getCmp('quarter-slider');	
                            var qt_start = quarters.getValues()[0];
                            var qt_end = quarters.getValues()[1];
                            
                            quarters.setValue(0, qt_start-1);
                            quarters.setValue(1, qt_end-1);
                            
                            Ext.getCmp('quarter-min-field').setValue(quarters.getValues()[0]);
                            Ext.getCmp('quarter-max-field').setValue(quarters.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    })
                ]
            }, 
            {
                height:40,
                colspan:2, 
                layout:'hbox',
                border : false,
                layoutConfig: {
                  border: false
                },
                items: [
                    new Ext.Button({
                        tooltip: "Large interval decrement",
                        tooltipType: 'title',
                        iconCls: "year-min-largestep",
                        handler: function(){
                            var years = Ext.getCmp('years-slider');	
                            var yr_start = years.getValues()[0];
                            var yr_end = years.getValues()[1];
                            
                            years.setValue(0, yr_start-10);
                            years.setValue(1, yr_end-10);
                            
                            Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
                            Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    }),
                    new Ext.Button({
                        tooltip: "Small interval decrement",
                        tooltipType: 'title',
                        iconCls: "year-min-littlestep",
                        handler: function(){
                            var years = Ext.getCmp('years-slider');	
                            var yr_start = years.getValues()[0];
                            var yr_end = years.getValues()[1];
                            
                            years.setValue(0, yr_start-1);
                            years.setValue(1, yr_end-1);
                            
                            Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
                            Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    }), 
                    {
                        id : 'years-min-field',
                        xtype: 'textfield',
                        readOnly: true,
                        width: 40,
                        value: new Date().getFullYear() - 1
                    },
                    new Ext.slider.MultiSlider({
                        id : 'years-slider',
                        vertical : false,
                        width   : 563,
                        minValue: 1970,
                        maxValue: new Date().getFullYear(),
                        values  : [new Date().getFullYear() - 1, new Date().getFullYear()],
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
                    }),
                    {
                        id : 'years-max-field',
                        xtype: 'textfield',
                        readOnly: true,
                        width: 40,
                        value: new Date().getFullYear()
                    },
                    new Ext.Button({
                        tooltip: "Small interval increment",
                        tooltipType: 'title',
                        iconCls: "year-max-littlestep",
                        handler: function(){
                            var years = Ext.getCmp('years-slider');	
                            var yr_start = years.getValues()[0];
                            var yr_end = years.getValues()[1];
                            
                            years.setValue(0, yr_start+1);
                            years.setValue(1, yr_end+1);
                            
                            Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
                            Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    }),				
                    new Ext.Button({
                        tooltip: "Large interval increment",
                        tooltipType: 'title',
                        iconCls: "year-max-largestep",
                        handler: function(){
                            var years = Ext.getCmp('years-slider');	
                            var yr_start = years.getValues()[0];
                            var yr_end = years.getValues()[1];
                            
                            years.setValue(0, yr_start+10);
                            years.setValue(1, yr_end+10);
                            
                            Ext.getCmp('years-min-field').setValue(years.getValues()[0]);
                            Ext.getCmp('years-max-field').setValue(years.getValues()[1]);
                            
                            if (validateSelection()) {
                              issueUpdate();
                            }
                        }
                    })
                ]
            },
            {
               xtype: 'tabpanel',
               width: 730,
               height: 500,
               colspan : 2,
               activeTab: 0,
               border: false,  
               items: [
                  {
                      xtype: 'panel',
                      title: 'Controls',
                      items: [
                          {
                              xtype: 'panel',
                              height: 150,
                              border: false,
                              autoScroll: true,
                              bbar: new Ext.Toolbar({
                                  height: 30,
                                  style: 'padding: 0px;',
                                  items: [
                                      '->',
                                      new Ext.Button({
                                          id: 'map-button',
                                          text: 'Map',
                                          iconCls: 'map-button-img',
                                          handler: function(){                                              
                                              if (validateMap()) {
                                                issueUpdate();
                                              }else{
                                                  if(selectedSpecies.length < 1){
                                                      document.getElementById('species').value = -1;
                                                  }
                                                  
                                                  if(selectedGears.length < 1){
                                                      document.getElementById('gearType').value = -1;
                                                  }
                                                  
                                                  document.getElementById('tabspecies').innerHTML = "";
                                                  document.getElementById('tabgears').innerHTML = "";
                                                  document.getElementById('tabquarters').innerHTML = "";
                                                  document.getElementById('tabperiod').innerHTML = "";
                                                  document.getElementById('tabtitle').innerHTML = "";
                                              }
                                          }
                                      }),
                                      new Ext.Button({
                                          id: 'print-button',
                                          text: 'Print',
                                          disabled: true,
                                          iconCls: 'print-button-img',
                                          handler: function(){                                              
                                              if (validateMap()) {
                                                 var href = location.href;
                                                  var baseURL = location.href.replace(/index/,'print');
                                                  baseURL += '?' + getViewParams();
                                                  window.open(baseURL);
                                              }
                                          }
                                      })
                                  ]
                              }),
                              html : ['<table  class="gfi" border="0" cellpadding="0" cellspacing="0" style="width:600px;">',
                                '<tr>',
                                '<td style="width:200px;"><b>Statistic Operation</b></td>',
                                '<td style="width:200px;">',
                                '<select id="gearType" style="width:182px;">',
                                '<option value="-1">Gear Types</option>',
                                '</select>',
                                '</td>',
                                '<td style="width:20px;">',
                                '<div id="gearslist"></div>',
                                '</td>',
                                '<td style="width:210px;">',
                                '<select id="species" style="width:182px;">',
                                '<option value="-1">Species</option>',
                                '</select>',
                                '</td>',
                                '<td style="width:20px;">',
                                '<div id="specieslist"></div>',
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
                                '</td>',
                                '<td style="vertical-align:top;">',
                                '<div id="selectedSpecies"></div>',
                                '</td>',
                                '</tr>',
                                '</table>'].join('')
                          },
                          {
                              xtype: 'panel',
                              height: 300,
                              autoScroll: true,
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
                          }
                   ]
                 },{
                     xtype: 'panel',
                     title: 'Animations',
                     disabled: true
                 }
               ]
           }, {
               width: 730,
               colspan : 2,
               border:false,
               html: [
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
    
    document.getElementById('specieslist').innerHTML = "<img src=\"images/grid-loading.gif\">";   
    var speciesURL = Tuna.speciesURL;
    Ext.Ajax.request({
       url: speciesURL,
       method: 'GET',
       timeout: Tuna.http_timeout,
       success: function(response, opts){
            document.getElementById('specieslist').innerHTML = "";
            var json = Ext.decode( response.responseText );
            
            var size = json.length;
            for(var i=0; i<size; i++){
                var option = document.createElement("option"); 
                option.value = json[i].ficItem;
                option.innerHTML = json[i].name;
                document.getElementById("species").appendChild(option); 
            }
       },
       failure:  function(response, opts){
            document.getElementById('specieslist').innerHTML = "";
            Ext.Msg.show({
               title: "Species Types Loading",
               msg: "An error occurred while loading Species Types: " + response.status,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
       }
    });
    
    document.getElementById('gearslist').innerHTML = "<img src=\"images/grid-loading.gif\">";
    var gearsURL = Tuna.gearsURL;
    Ext.Ajax.request({
       url: gearsURL,
       method: 'GET',
       timeout: Tuna.http_timeout,
       success: function(response, opts){
            document.getElementById('gearslist').innerHTML = "";
            var json = Ext.decode( response.responseText );
            
            var size = json.length;
            for(var i=0; i<size; i++){
                var option = document.createElement("option"); 
                option.value = json[i].gearType;
                option.innerHTML = json[i].name;
                document.getElementById("gearType").appendChild(option);
            }
       },
       failure:  function(response, opts){
            document.getElementById('gearslist').innerHTML = "";
            Ext.Msg.show({
               title: "Gears Types Loading",
               msg: "An error occurred while loading Gears Types: " + response.status,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
       }
    });
    
    /*$('#species').click(function () {
        var childs = document.getElementById("species").childNodes.length;
        
        if(childs == 1){
            document.getElementById('specieslist').innerHTML = "<img src=\"images/grid-loading.gif\">";
        
            var url = Tuna.speciesURL;
            Ext.Ajax.request({
               url: url,
               method: 'GET',
               timeout: Tuna.http_timeout,
               success: function(response, opts){
                    document.getElementById('specieslist').innerHTML = "";
                    var json = Ext.decode( response.responseText );
                    
                    var size = json.length;
                    for(var i=0; i<size; i++){
                        var option = document.createElement("option"); 
                        option.value = json[i].ficItem;
                        option.innerHTML = json[i].name;
                        document.getElementById("species").appendChild(option); 
                    }
               },
               failure:  function(response, opts){
                    Ext.Msg.show({
                       title: "Species Types Loading",
                       msg: "An error occurred while loading Species Types: " + response.status,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });
               }
            });
        }
    });
    
    $('#gearType').click(function () {
        var childs = document.getElementById("gearType").childNodes.length;
        
        if(childs == 1){
            document.getElementById('gearslist').innerHTML = "<img src=\"images/grid-loading.gif\">";

            var url = Tuna.gearsURL;
            Ext.Ajax.request({
               url: url,
               method: 'GET',
               timeout: Tuna.http_timeout,
               success: function(response, opts){
                    document.getElementById('gearslist').innerHTML = "";
                    var json = Ext.decode( response.responseText );
                    
                    var size = json.length;
                    for(var i=0; i<size; i++){
                        var option = document.createElement("option"); 
                        option.value = json[i].gearType;
                        option.innerHTML = json[i].name;
                        document.getElementById("gearType").appendChild(option);
                    }
               },
               failure:  function(response, opts){
                    Ext.Msg.show({
                       title: "Gears Types Loading",
                       msg: "An error occurred while loading Gears Types: " + response.status,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });
               }
            });
        }
    });*/
    
    $('#avg').change(function () {   
        Ext.getCmp('print-button').disable();
    });
    
    $('#sum').change(function () {   
        Ext.getCmp('print-button').disable();
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
                "</span></td><td><a href='#' onclick='removeMe(this, \"gearType\", \"" + selection + "\");' style='float:right;display:block;width:60px;'>remove</a></td></tr></table></div>").appendTo($('#selectedGearType'));
            
                selectedGears.push(selection);
            }
        }
        
        Ext.getCmp('print-button').disable();
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
                "</span></td><td><a href='#' onclick='removeMe(this, \"species\", \"" + selection + "\");' style='float:right;display:block;width:60px;'>remove</a></td></tr></table></div>").appendTo($('#selectedSpecies'));			
                
                selectedSpecies.push(selection);	
            }
        }
        
        Ext.getCmp('print-button').disable();
    });
	
    var getViewParams = function(){
        // //////////////////////////////////////////////////////////////////////////////////
        // VIEWPARAMS Example:
        //    viewparams: 'FIC_ITEM:2494\,2498;CD_GEAR:802\,803\,805;YR_TA:1960\,1961\,1962' 
        // //////////////////////////////////////////////////////////////////////////////////
        
        var cd_gear =  'CD_GEAR:';
        
        for(g = 0; g < $('#selectedGearType').find('tr').length; g++) {
            var selected = $($('#selectedGearType').find('tr')[g]).contents()[0];
            var value = $($(selected).contents()[0]).attr('value');
            cd_gear += value + (g < $('#selectedGearType').find('tr').length - 1 ? '\\,' : '');
        }
        
        var fic_item = 'FIC_ITEM:';

        for(g = 0; g < $('#selectedSpecies').find('tr').length; g++) {
            var selected = $($('#selectedSpecies').find('tr')[g]).contents()[0];
            var value = $($(selected).contents()[0]).attr('value');
            fic_item += value + (g < $('#selectedSpecies').find('tr').length - 1 ? '\\,' : '');
        }		
        
        var years = Ext.getCmp('years-slider');	
        var yr_start = years.getValues()[0];
        var yr_end = years.getValues()[1];
        
        var yr_ta = 'YR_TA:';
          
        for(y = 0; y <= (yr_end - yr_start); y++) {
            yr_ta += (yr_start + y) + (y <= (yr_end - yr_start)-1 ? '\\,' : '');
        }
        
        var quarters = Ext.getCmp('quarter-slider');	
        var qt_start = quarters.getValues()[0];
        var qt_end = quarters.getValues()[1];
        
        var qt_ta = 'QTR_TA:';
        
        for(var q = 0; q <= (qt_end - qt_start ); q++) {
            qt_ta += (qt_start + q) + (q <= (qt_end - qt_start)-1 ? '\\,' : '');
        }
        
        var statistic = 'OP:' +  ($('#avg').attr("checked") ? 'avg' : 'sum');
        
        var viewparams =  [cd_gear, fic_item, yr_ta, qt_ta, statistic].join(';');
        
        return viewparams;
    };
      
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
          '<img alt="" src="' + Tuna.vars.wms + '?' + legendParams.join('&')+'">';
          
        document.getElementById('nodelist').innerHTML = '';
        document.getElementById('brkdwn_nodelist').innerHTML = '';	
        
        //
        // Filling map information table 
        // 
        document.getElementById('tabspecies').innerHTML = selectedSpecies.join(',');
        document.getElementById('tabgears').innerHTML = selectedGears.join(',');
        
        var quarters = Ext.getCmp('quarter-slider');	
        var qt_start = quarters.getValues()[0];
        var qt_end = quarters.getValues()[1];
        
        var qt_ta = '';
        
        for(var q = 0; q <= (qt_end - qt_start ); q++) {
          qt_ta += (qt_start + q) + (q <= (qt_end - qt_start)-1 ? ',' : '');
        }
        
        document.getElementById('tabquarters').innerHTML = qt_ta;
        
        var years = Ext.getCmp('years-slider');	
        var yr_start = years.getValues()[0];
        var yr_end = years.getValues()[1];
        
        var yr_ta = '';
          
        for(y = 0; y <= (yr_end - yr_start); y++) {
          yr_ta += (yr_start + y) + (y <= (yr_end - yr_start)-1 ? ',' : '');
        }
        
        document.getElementById('tabperiod').innerHTML = yr_ta;
        
        var statistic = ($('#avg').attr("checked") ? 'Average' : 'Cumulative') + " Tuna Yearly Catches";
        
        document.getElementById('tabtitle').innerHTML = statistic;
        
        Ext.getCmp('print-button').enable();
    }
});

function validateMap() {
    if ($('#avg')[0].checked) {
        var years = Ext.getCmp('years-slider');
        
        if (years.getValues()[0] == years.getValues()[1]){
            Ext.Msg.show({
               title: "Map Draw",
               msg: "Please select at least two years",
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.WARNING
            });
            
            return false;
        }
    }

    /*if (($('#selectedGearType').children().length == 0) || ($('#selectedSpecies').children().length == 0)) {
        Ext.Msg.show({
           title: "Map Draw",
           msg: "Please select at least one Gear Type and one Species",
           buttons: Ext.Msg.OK,
           icon: Ext.MessageBox.WARNING
        });
        
        return false;
    }*/
    
    if ((selectedGears.length < 1) || (selectedSpecies.length < 1)) {
        Ext.Msg.show({
           title: "Map Draw",
           msg: "Please select at least one Gear Type and one Species",
           buttons: Ext.Msg.OK,
           icon: Ext.MessageBox.WARNING
        });
        
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
	
function removeMe(sender, type, selection) {
    var value = $(sender.parentNode.parentNode).find('span').attr('value')
    $(sender.parentNode.parentNode.parentNode.parentNode).remove();
    
    $('#'+type+' option[value='+value+']').attr('disabled', '');
          
    if(type.indexOf("species") != -1){
        selectedSpecies.pop(selection);
    }else if(type.indexOf("gearType") != -1){
        selectedGears.pop(selection);
    }
    
    Ext.getCmp('print-button').disable();
}