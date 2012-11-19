/*
 * PersistenceGeoParser.js Copyright (C) 2012 This file is part of PersistenceGeo project
 * 
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 * 
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 */

/** api: (define)
 *  module = PersistenceGeo
 */
Ext.namespace("PersistenceGeo");

/**
 * Class: PersistenceGeo.Context
 * 
 * The PersistenceGeo.Context is designed to store user information
 *
 */
PersistenceGeo.Context = Ext.extend(Ext.util.Observable,{

	userLogin: null,
	authUser: null,
	activeStore: false,
	map: null,

    SAVE_MODES:{
        GROUP: 1,
        USER: 2
    },
    
    constructor: function(config) {
        for (var key in config){
            this[key] = config[key];
        }
        PersistenceGeo.Context.superclass.constructor.call(this, config);
    },
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        PersistenceGeo.Context.superclass.initComponent.apply(this, arguments);
    },

    canBeBaseLayer: function(){
        //TODO integrate
        return false;
    },

    addLayer: function(layer){
    	if(this.activeStore){
    		this.saveLayer(layer);
    	}else{
    		this.map.addLayer(layer);
    	}
    },

    saveLayer: function(layer, nameLayer, folderID){
        // Add the folder id to the layer
        layer.groupLayersIndex = folderID;
        // Get the layer params to save them
        var properties = {
                transparent: true,
                buffer: 0,
                visibility: false,
                opacity: 0.5,
                format: layer.params.FORMAT,
                maxExtent: layer.maxExtent.toString(),
                layers: layer.params.LAYERS,
                order: map.layers.length
        };
        
        var url = layer.url;
        
        if(url.indexOf(OpenLayers.ProxyHost) > -1){
            url = url.substring(url.indexOf(OpenLayers.ProxyHost) + OpenLayers.ProxyHost.length);
        }
        
        params = {
                name: nameLayer,
                server_resource: url,
                type: layer.params.SERVICE,
                folderId: folderID,
                properties: properties
        };

        if(this.canBeBaseLayer()){
            params.properties.isBaseLayer = this.control.form.get("inputIsBaseLayer").getValue();
        }

        //Layer save
        if(!!this.SAVE_MODES.GROUP == type){
            PersistenceGeoParser.saveLayerByGroup(this.authUser, params,
                    function(form, action){
                        /*
                         * ON SUCCESS
                         */
                        var json = Ext.util.JSON.decode(action.response.responseText);
                        var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
                        Viewer.addLayer(layer); // TODO: exists?
                        this_.windowLocationLayer.close();
                    },
                    function(form, action){
                        /*
                         * ON FAILURE 
                         */
                        var json = Ext.util.JSON.decode(action.response.responseText);
                        var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
                        Viewer.addLayer(layer); // TODO: exists?
                        this_.windowLocationLayer.close();
            });
        }else{
            PersistenceGeoParser.saveLayerByUser(this.userLogin, params,
                    function(form, action){
                        /*
                         * ON SUCCESS
                         */
                        var json = Ext.util.JSON.decode(action.response.responseText);
                        var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
                        Viewer.addLayer(layer); // TODO: exists?
                        this_.windowLocationLayer.close();
                    },
                    function(form, action){
                        /*
                         * ON FAILURE 
                         */
                        var json = Ext.util.JSON.decode(action.response.responseText);
                        var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
                        Viewer.addLayer(layer); // TODO: exists?
                        this_.windowLocationLayer.close();
            });
        }
    }

});

