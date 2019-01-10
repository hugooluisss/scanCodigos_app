/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var objUsuario = null;
var plantillas = {};
var pantallas = [];
var db = null;

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		try{
			db = window.sqlitePlugin.openDatabase({name: 'scan.db', location: 1, androidDatabaseImplementation: 2});
			console.log("Conexión desde phonegap OK");
			crearBD(db);
		}catch(err){
			alertify.error("No se pudo crear la base de datos con sqlite... se intentará trabajar con web");
			db = window.openDatabase("scan.db", "1.0", "Just a Dummy DB", 200000);
			crearBD(db);
			console.log("Se inicio la conexión a la base para web");
		}
		
		document.addEventListener("backbutton", function(){
			mensajes.confirm({"titulo": "Salir", "mensaje": "¿Seguro de salir?", "botones": ["Salir", "Cancelar"], "funcion": function(resp){
				if (resp == 1)
					callLogout();
			}});
		}, false);
	}
};

app.initialize();

$(document).ready(function(){
	//app.onDeviceReady();
	objUsuario = new TUsuario;
	if (!objUsuario.isLogin())
		location.href = "index.html";
		
	
	plantillas["home"] = "";
	plantillas["itemVenta"] = "";
	setPanel();
	
	getPlantillas(function(){
		callPanel("home");
	});
});

function callPanel(panel){
	$("#navbarSupportedContent").removeClass("show");
	switch(panel){
		case 'home':
			callHome();
		break;
		default:
			console.info("Panel no encontrado");
	}
}