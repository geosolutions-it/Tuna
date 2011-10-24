AnimationPanel = Ext.extend(Ext.FormPanel, {

    border: false,
    
    map: null,
    
    initComponent: function() {  
   
        var yearStore = new Ext.data.JsonStore({
            idProperty: 'year',
            root : "years",
            totalProperty: "results",
            proxy: new Ext.data.HttpProxy({
                url: Tuna.yearsURL,
                timeout: Tuna.http_timeout,
                method: 'GET'
            }),
            fields: [{name:'year', mapping: 'year'}]
        });
        
        this.startYear = new Ext.form.ComboBox({
            fieldLabel: "Start Year",
            allowBlank: true,
            disabled: false,
            emptyText: "Select Start Year",
            mode: "remote",
            triggerAction: "all",
            displayField: "year",
            valueField: "year",
            width: 150,
            store: yearStore,
            editable: false
        });
        
        this.endYear = new Ext.form.ComboBox({
            fieldLabel: "End Year",
            allowBlank: true,
            disabled: false,
            emptyText: "Select End Year",
            mode: "remote",
            triggerAction: "all",
            displayField: "year",
            valueField: "year",
            width: 150,
            store: yearStore,
            editable: false
        });
        
        this.increment = new Ext.form.SliderField({
            fieldLabel: "Yearly Increment",
            width: 180
        });
        
        this.frameRate = new Ext.form.NumberField({
            fieldLabel: "Frame Rate (ms)",
            allowDecimals: false,
            allowNegative: false,
            value: 1000
        });
        
        this.imageWidth = new Ext.form.NumberField({
            fieldLabel: "Width (between 256 and 1024)",
            minValue: 256,
            maxValue: 1024,
            allowBlank : false,
            allowDecimals: false,
            allowNegative: false,
            value: 900
        });
        
        this.loop = new Ext.form.Checkbox({
            fieldLabel: "Loop Continuosly"
        });
        
        this.useBBOX = new Ext.form.Checkbox({
            fieldLabel: "Use Map Extent"
        });
        
        //
        // Years and Quarters group
        //
        var yq = [{
            bodyStyle: 'padding-right:5px;',
            items: {
                xtype: 'fieldset',
                title: 'YEARS',
                autoHeight: true,
                items: [
                    this.startYear,
                    this.endYear,
                    this.increment
                ]
            }
        }, {
            bodyStyle: 'padding-left:5px;',
            items: {
                xtype: 'fieldset',
                title: 'QUARTERS',
                autoHeight: true,
                items: [
                    {
                        xtype: 'checkboxgroup',
                        id: 'qt-check',
                        columns: 4,
                        items: [
                            {boxLabel: '1', name: 'qt-col', inputValue: "1", checked: true},
                            {boxLabel: '2', name: 'qt-col', inputValue: "2", checked: true},
                            {boxLabel: '3', name: 'qt-col', inputValue: "3", checked: true},
                            {boxLabel: '4', name: 'qt-col', inputValue: "4", checked: true}
                        ]
                    }
                ]
            }
        }];
        
        //
        // Span type and advanced options group
        //
        var so = [{
            bodyStyle: 'padding-right:5px;',
            items: {
                xtype: 'fieldset',
                title: 'SPAN TYPE',
                autoHeight: true,
                items: [
                    {
                        xtype: 'radiogroup',
                        id: 'span-radio',
                        columns: 1,
                        items: [
                            {boxLabel: 'Across Years', name: 'span-col', inputValue: "years", checked: true},
                            {boxLabel: 'Across Quarters', name: 'span-col', inputValue: "quartes"}
                        ]
                    }
                ]
            }
        }, {
            bodyStyle: 'padding-left:5px;',
            items: {
                xtype: 'fieldset',
                title: 'ADVANCED OPTIONS',
                collapsible: true,
                collapsed: true,
                autoHeight: true,
                items: [
                    this.frameRate,
                    this.loop,
                    this.imageWidth,
                    this.useBBOX
                ]
            }
        }];
        
        this.buttons = [
           new Ext.Button({
                text: "Download Gif",
                tooltip: "Download Gif",
                iconCls: 'map-button-img',
                scope: this,
                handler: function(){
 var bool = false;
                     
                    var url = Tuna.animationsURL;   
                    
                    //
                    // Filling Layers for WMS Animator
                    //
                    if (OpenLayers.Util.alphaHack()) {
                        url += "layers=fifao:GRID_G5,fifao:TUNA_YEARLY_CATCHES,fifao:UN_CONTINENT&";
                    } else {
                        url += "layers=fifao:UN_CONTINENT,fifao:GRID_G5,fifao:TUNA_YEARLY_CATCHES,fifao:FAO_MAJOR,fifao:UN_CONTINENT&";
                    }
                     
                    url += "format=image/gif;";
                    url += "subtype=animated&";
                    
                    if(Ext.getCmp('span-radio').getValue().initialConfig.inputValue == 'years'){
                    
                        var quarters = Ext.getCmp('qt-check').getValue();
                        if(this.startYear.isDirty() && this.endYear.isDirty() && quarters.length > 0){
                              
                            //
                            // Manage YEARS WMS request
                            //
                            var start = this.startYear.getValue();
                            var end = this.endYear.getValue();                                
                            
                            if(end < start){
                                Ext.Msg.show({
                                   title: "Animation Error",
                                   msg: "End year is greater than start year !",
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR
                                });
                            }else{                               
                                url += "aparam=viewparams:YR_TA&";
                                url += "avalues=";

                                for(var i=start; i<=end; (this.increment.getValue() != 0 ? i+=this.increment.getValue() : i++)){
                                   url += i;
                                   
                                   if(i < end)
                                      url += ",";
                                   else
                                      url += "&";
                                }     
                                
                                bool = true;                           
                            }
                            
                            if(this.increment.getValue() > (end - start)){
                                Ext.Msg.show({
                                   title: "Animation Error",
                                   msg: "Yearly Increment value is greater than the years range !",
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR
                                });
                                
                                bool = false;
                            }
                        }else{
                            Ext.Msg.show({
                               title: "Animation Error",
                               msg: "Start and End year and at least one Quarter must be filled !",
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.ERROR
                            });
                        }
                    }else{
                    
                        //
                        // Manage QUARTERS WMS request
                        //                           
                        var quarters = Ext.getCmp('qt-check').getValue();
                        if(this.startYear.isDirty() && this.endYear.isDirty() && quarters.length > 0){
                        
                            url += "aparam=viewparams:QTR_TA&";
                            url += "avalues=";
                            
                            for(var i=0; i<quarters.length; i++){
                               url += quarters[i].initialConfig.inputValue;
                               
                               if(i < quarters.length - 1)
                                  url += ",";
                               else
                                  url += "&";
                            }
                            
                            bool = true;
                            
                        }else{
                            Ext.Msg.show({
                               title: "Animation Error",
                               msg: "Start and End year and at least one Quarter must be filled !",
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                    
                    //
                    // Checking advanced options
                    //
                    //if(this.imageWidth.isDirty()){
                        if(this.imageWidth.isValid()){
                            var imgWidth = this.imageWidth.getValue();
                            url += "width=" + imgWidth + "&";
                        }
                    //}
                    
                    if(this.loop)
                        url += "format_options=gif_loop_continuosly:" + this.loop.getValue();
                        
                    if(this.frameRate.isDirty()){
                        if(this.frameRate.isValid())   
                            url += ";gif_frames_delay:" + this.frameRate.getValue();
                    }
                    
                    if(this.useBBOX.getValue()){
                        var bounds = this.map.getExtent();
                        url += "&bbox=" + bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;                       
                    }
                    
                    if(bool){                            
                        url += "&viewparams=" + this.getViewParams();
                        
                        var timestamp = new Date();
                        url += "&timestamp=" + timestamp.getTime();
                         
                	//alert(url);
                	window.open(url);
			}
                }
            }),
            new Ext.Button({
                text: "Animation",
                tooltip: "Run the Animation",
                iconCls: 'animation-button',
                scope: this,
                handler: function(){ 
                    var bool = false;
                     
                    var url = Tuna.animationsURL;   
                    
                    //
                    // Filling Layers for WMS Animator
                    //
                    if (OpenLayers.Util.alphaHack()) {
                        url += "layers=fifao:GRID_G5,fifao:TUNA_YEARLY_CATCHES,fifao:UN_CONTINENT&";
                    } else {
                        url += "layers=fifao:UN_CONTINENT,fifao:GRID_G5,fifao:TUNA_YEARLY_CATCHES,fifao:FAO_MAJOR,fifao:UN_CONTINENT&";
                    }
                     
                    url += "format=image/gif;";
                    url += "subtype=animated&";
                    
                    if(Ext.getCmp('span-radio').getValue().initialConfig.inputValue == 'years'){
                    
                        var quarters = Ext.getCmp('qt-check').getValue();
                        if(this.startYear.isDirty() && this.endYear.isDirty() && quarters.length > 0){
                              
                            //
                            // Manage YEARS WMS request
                            //
                            var start = this.startYear.getValue();
                            var end = this.endYear.getValue();                                
                            
                            if(end < start){
                                Ext.Msg.show({
                                   title: "Animation Error",
                                   msg: "End year is greater than start year !",
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR
                                });
                            }else{                               
                                url += "aparam=viewparams:YR_TA&";
                                url += "avalues=";

                                for(var i=start; i<=end; (this.increment.getValue() != 0 ? i+=this.increment.getValue() : i++)){
                                   url += i;
                                   
                                   if(i < end)
                                      url += ",";
                                   else
                                      url += "&";
                                }     
                                
                                bool = true;                           
                            }
                            
                            if(this.increment.getValue() > (end - start)){
                                Ext.Msg.show({
                                   title: "Animation Error",
                                   msg: "Yearly Increment value is greater than the years range !",
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR
                                });
                                
                                bool = false;
                            }
                        }else{
                            Ext.Msg.show({
                               title: "Animation Error",
                               msg: "Start and End year and at least one Quarter must be filled !",
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.ERROR
                            });
                        }
                    }else{
                    
                        //
                        // Manage QUARTERS WMS request
                        //                           
                        var quarters = Ext.getCmp('qt-check').getValue();
                        if(this.startYear.isDirty() && this.endYear.isDirty() && quarters.length > 0){
                        
                            url += "aparam=viewparams:QTR_TA&";
                            url += "avalues=";
                            
                            for(var i=0; i<quarters.length; i++){
                               url += quarters[i].initialConfig.inputValue;
                               
                               if(i < quarters.length - 1)
                                  url += ",";
                               else
                                  url += "&";
                            }
                            
                            bool = true;
                            
                        }else{
                            Ext.Msg.show({
                               title: "Animation Error",
                               msg: "Start and End year and at least one Quarter must be filled !",
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                    
                    //
                    // Checking advanced options
                    //
                    //if(this.imageWidth.isDirty()){
                        if(this.imageWidth.isValid()){
                            var imgWidth = this.imageWidth.getValue();
                            url += "width=" + imgWidth + "&";
                        }
                    //}
                    
                    if(this.loop)
                        url += "format_options=gif_loop_continuosly:" + this.loop.getValue();
                        
                    if(this.frameRate.isDirty()){
                        if(this.frameRate.isValid())   
                            url += ";gif_frames_delay:" + this.frameRate.getValue();
                    }
                    
                    if(this.useBBOX.getValue()){
                        var bounds = this.map.getExtent();
                        url += "&bbox=" + bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;                       
                    }
                    
                    if(bool){                            
                        url += "&viewparams=" + this.getViewParams();
                        
                        var timestamp = new Date();
                        url += "&timestamp=" + timestamp.getTime();
                        //alert(url);
                                                                        
                        var animationWin = new Ext.Window({
                            title: 'Animation',
                            iconCls: 'amination-win',
                            closable: true,
                            width: (this.imageWidth.isDirty() && this.imageWidth.isValid()) ? this.imageWidth.getValue() : 900,
                            height: 350,
                            modal: true,
                            layout: 'border',
                            bodyStyle: 'padding: 5px;',
                            items: [
                                {
                                    region: 'south',
                                    width: 200,
                                    split: true,
                                    collapsible: true,
                                    border: false,
                                    floatable: false,               
                                    iconCls: 'map-info',
                                    title: "Map Information",
                                    autoScroll: true,
                                    html: [
                                        '<table class="reftopmenu" border="0" cellpadding="2" cellspacing="2" width="100%"><tbody>',
                                        '<tr>',
                                        '<td align="left" nowrap="nowrap" width="5%"><b>Map Title:</b>',
                                        '</td>',
                                        '<td id="tabtitleinfo" align="left" width="95%">',
                                        '</td>',
                                        '</tr>',
                                        '<tr>',
                                        '<td align="left" width="5%"><b>Species:</b>',
                                        '</td>',
                                        '<td id="tabspeciesinfo" align="left" width="95%">',
                                        '</td>',
                                        '</tr>',
                                        '<tr>',
                                        '<td align="left" width="5%"><b>Gears:</b>',
                                        '</td>',
                                        '<td id="tabgearsinfo" align="left" width="95%">',
                                        '</td>',
                                        '</tr>',
                                        '<tr>',
                                        '<td align="left" width="5%"><b>Periods:</b>',
                                        '</td>',
                                        '<td id="tabperiodinfo" align="left" width="95%">',							
                                        '</td>',
                                        '</tr>',
                                        '<tr>',
                                        '<td align="left" width="5%"><b>Quarters:</b>',
                                        '</td>',
                                        '<td id="tabquartersinfo" align="left" width="95%">',							
                                        '</td>',
                                        '</tr>',
                                        '<tr>',
                                        '<td colspan="2">',
                                        '</td>',
                                        '</tr></tbody>',
                                        '</table>'
                                    ].join('')
                                },{
                                    xtype: 'panel',
                                    region: 'center',
                                    id: 'image-panel',
                                    autoScroll: true,
                                    border: false,
                                    items: [
                                      new Ext.ux.Image ({ id: 'imgPreview', url: url })  
                                    ]
                                }
                            ]
                        });
                        
                        animationWin.show();
                        this.fillAnimationInfo();
                    }
                }
            })
        ];
        

                
        this.items = [
            {
                layout: 'column',
                border: false,
                // defaults are applied to all child items unless otherwise specified by child item
                defaults: {
                    columnWidth: '.5',
                    border: false
                },            
                items: yq
            },
            {
                layout: 'column',
                border: false,
                // defaults are applied to all child items unless otherwise specified by child item
                defaults: {
                    columnWidth: '.5',
                    border: false
                },            
                items: so
            }        
        ];

        AnimationPanel.superclass.initComponent.call(this);
    },
    
    getPanel: function(){        
        return this;
    },
    
    fillAnimationInfo: function(){
        //
        // Filling map information table 
        // 
        document.getElementById('tabspeciesinfo').innerHTML = selectedSpecies.join(',');
        document.getElementById('tabgearsinfo').innerHTML = selectedGears.join(',');
            
        //
        // Setting quarters values from the animation form
        // 
        var quarters = Ext.getCmp('qt-check').getValue();
        var qtta = '';
        for(var i=0; i<quarters.length; i++){
           qtta += quarters[i].initialConfig.inputValue;
           
           if(i < quarters.length - 1)
              qtta += ",";
        }
        
        document.getElementById('tabquartersinfo').innerHTML = qtta;

        var start = this.startYear.getValue();
        var end = this.endYear.getValue();                             
        var yrta = '';

        for(var i=start; i<=end; i++){
           yrta += i;
           
           if(i < end)
              yrta += ",";
        }     
        
        document.getElementById('tabperiodinfo').innerHTML = yrta;

        var statistic = ($('#avg').attr("checked") ? 'Average' : 'Cumulative') + " Tuna Yearly Catches";
        
        document.getElementById('tabtitleinfo').innerHTML = statistic;
    },
    
    getViewParams: function(){
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
        
        var yr_ta;
        var qt_ta;
        
        if(Ext.getCmp('span-radio').getValue().initialConfig.inputValue == 'quartes'){            
            var yr_start = this.startYear.getValue();
            var yr_end = this.endYear.getValue();                               
            
            yr_ta = 'YR_TA:';
              
            for(y = 0; y <= (yr_end - yr_start); y++) {
                yr_ta += (yr_start + y) + (y <= (yr_end - yr_start)-1 ? '\\,' : '');
            }
            
        }else{            
            var quarters = Ext.getCmp('qt-check').getValue();
            
            qt_ta = 'QTR_TA:';
            
            for(var i=0; i<quarters.length; i++){
               qt_ta += quarters[i].initialConfig.inputValue;
               
               if(i < quarters.length - 1)
                  qt_ta += "\\,";
            }
        }

        var statistic = 'OP:' +  ($('#avg').attr("checked") ? 'avg' : 'sum');
        
        var viewparams;
        if(yr_ta){
            viewparams =  [cd_gear, fic_item, yr_ta, statistic].join(';');
        }else{
            viewparams =  [cd_gear, fic_item, qt_ta, statistic].join(';');
        }
        
        
        return viewparams;
    }
});

Ext.ux.Image = Ext.extend(Ext.BoxComponent, {

    url  : Ext.BLANK_IMAGE_URL,  //for initial src value
    
    mask: null,

    imageCtrl: false,

    autoEl: {
        tag: 'img',
        src: Ext.BLANK_IMAGE_URL,
        cls: 'tng-managed-image'
    },

   initComponent : function(){
         Ext.ux.Image.superclass.initComponent.call(this);
         this.addEvents('load');
   },
   
   //
   //  Add our custom processing to the onRender phase.
   //  We add a ‘load’ listener to our element.
   //  
   onRender: function() {
       Ext.ux.Image.superclass.onRender.apply(this, arguments);
       this.el.on('load', this.onLoad, this);
       if(this.url){
           this.setSrc(this.url);
       }
   },

   onLoad: function() {
       if(!Ext.isIE && !Ext.isChrome){
           if(this.imageCtrl){   
               this.mask.hide();
           }
               
           this.imageCtrl = true;
       }else{
           this.mask.hide();
       }      

       this.fireEvent('load', this);                
   },

   setSrc: function(src) {
       this.el.dom.src = src;
       
       this.mask = new Ext.LoadMask(Ext.getCmp('image-panel').getEl(), {msg:"Please wait..."});
       this.mask.show();
   }
});
