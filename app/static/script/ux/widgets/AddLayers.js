/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/NewSourceDialog.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AddLayers
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("Viewer.plugins");

/** api: constructor
 *  .. class:: AddLayers(config)
 *
 *    Plugin for removing a selected layer from the map.
 *    TODO Make this plural - selected layers
 */
Viewer.plugins.AddLayers = Ext.extend(gxp.plugins.AddLayers, {

    ptype: "vw_addlayers",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var commonOptions = {
            tooltip : this.addActionTip,
            text: this.addActionText,
            menuText: this.addActionMenuText,
            disabled: true,
            iconCls: "gxp-icon-addlayers"
        };
        var options, uploadButton;
        if (this.initialConfig.search || (this.uploadSource)) {
            var items = [new Ext.menu.Item({
                iconCls: 'gxp-icon-addlayers', 
                text: this.addActionMenuText, 
                handler: this.showCapabilitiesGrid, 
                scope: this
            })];
            items.push(new Ext.menu.Item({
                iconCls: 'gxp-icon-addlayers', 
                text: "WFS",
                handler: this.showCatalogueWFSSearch,
                scope: this
            }));
            if (this.initialConfig.search) {
                items.push(new Ext.menu.Item({
                    iconCls: 'gxp-icon-addlayers', 
                    text: this.findActionMenuText,
                    handler: this.showCatalogueSearch,
                    scope: this
                }));
            }
            if (this.uploadSource) {
                uploadButton = this.createUploadButton(Ext.menu.Item);
                if (uploadButton) {
                    items.push(uploadButton);
                }
            }
            options = Ext.apply(commonOptions, {
                menu: new Ext.menu.Menu({
                    items: items
                })
            });
        } else {
            options = Ext.apply(commonOptions, {
                handler : this.showCapabilitiesGrid,
                scope: this
            });
        }
        var actions = gxp.plugins.AddLayers.superclass.addActions.apply(this, [options]);
        
        this.target.on("ready", function() {
            if (this.uploadSource) {
                var source = this.target.layerSources[this.uploadSource];
                if (source) {
                    this.setSelectedSource(source);
                } else {
                    delete this.uploadSource;
                    if (uploadButton) {
                        uploadButton.hide();
                    }
                    // TODO: add error logging
                    // throw new Error("Layer source for uploadSource '" + this.uploadSource + "' not found.");
                }
            }
            actions[0].enable();
        }, this);

        return actions;
    },

    showCatalogueWFSSearch: function(){
        var map_ = this.target.mapPanel.map;
        var wfsDialog = new Viewer.view.dialog.WfsWizard({
            listeners:{
                featureTypeAdded: function(record){
                    //TODO: get user info
                    var pgeoContext = new PersistenceGeo.Context({
                        map: map_
                    });
                    pgeoContext.addLayer(record.data.layer);
                }
            }
        });

        wfsDialog.show();
    }

});

Ext.preg(Viewer.plugins.AddLayers.prototype.ptype, Viewer.plugins.AddLayers);
