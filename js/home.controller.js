function callHome(){
	console.info("Llamando a home");
	$("#modulo").attr("modulo", "home").html(plantillas["home"]);
	setPanel($("#modulo"));
	console.info("Carga de home finalizada");
	
	objUsuario.getData({
		fn: {
			after: function(datos){
				setDatos($("#modulo"), datos);
			}
		}
	});
		
	$("#btnSalir").click(function(){
		alertify.confirm("¿Seguro?", function(e){
    		if(e) {
	    		callLogout();
	    	}
    	});
	});
	
	
	function getFuerza(){
		$("#selFuerza").find("option").remove();
		db.transaction(function(tx){
			tx.executeSql('select * from fuerza where visible = 1', [], function(tx, results){
				for(var i = 0; i < results.rows.length ; i++){
					$("#selFuerza").append('<option value="' + results.rows.item(i).idFuerza + '">' + results.rows.item(i).nombre + "</option");
				}
			});
		});
	}
	
	$("#btnSincronizarCatalogos").click(function(){
		sincronizarCatalogos();
	});
	
	$("#btnSincronizarVentas").click(function(){
		sincronizarVentas();
	});
	
	$("#btnLimpiarVentas").click(function(){
		$(".navbar-collapse").removeClass("show");
		mensajes.confirm({"mensaje": "¿Seguro de borrar todos los registros de ventas?", "titulo": "confirmar", "botones": "Si, No", "funcion": function(btn){
			if (btn == 1){
				db.transaction(function(tx){
					tx.executeSql('delete from venta', [], function(){
						listaVentas();
						mensajes.confirm({"titulo": "Listo", "mensaje": "Datos borrados"});
					});
				});
			}
		}});
	});
	
	chart = undefined;
	$('#winEstadistica').on('show.bs.modal', function(event){
		$(".navbar-collapse").removeClass("show");
		blockUI("Obteniendo datos del servidor");
		$.post(server + "cventas", {
			"action": "getVentasUsuarioMes",
			"usuario": objUsuario.idUsuario,
			"movil": true
		}, function(datos){
			unBlockUI();
			console.log(datos);
			var data = new google.visualization.DataTable();
			data.addColumn("string", "Día");
			data.addColumn("number", "Ventas");
			
			for(i in datos){
				el = datos[i];
				console.log(el);
				data.addRow([el.dia.toString(), parseInt(el.total)]);
			}
			chart.draw(data, {"width": "100%"});
		}, "json");
	});
	
	google.charts.load("current", {'packages': ['corechart']});
	google.charts.setOnLoadCallback(function(){
		chart = new google.visualization.ColumnChart(document.getElementById("dvReporteVentas"));
	});
	
	$('#winVenta').on('show.bs.modal', function(event){
		$("#frmVenta")[0].reset();
		getFuerza();
	});
	
	$('#winVenta').on('hide.bs.modal', function(event){
		listaVentas();
	});
	
	$("#btnScanIMEI").click(function(){
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				var s = result.text;
				for(x = s.length ; x < 15 ; x++){
					s = "0" + s;
				}
				
				$("#txtIMEI").val(s);
			}, function (error) {
				mensajes.log({"mensaje": "Scaneo cancelado"});
			}, {
				preferFrontCamera : false, // iOS and Android
				showFlipCameraButton : false, // iOS and Android
				showTorchButton : true, // iOS and Android
				torchOn: false, // Android, launch with the torch switched on (if available)
				saveHistory: true, // Android, save scan history (default false)
				prompt : "Scanea el IMEI", // Android
				resultDisplayDuration: 50, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
				//formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
				orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
				disableAnimations : true, // iOS
				disableSuccessBeep: false // iOS and Android
			});
	});
	$("#btnScanICCID").click(function(){
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				var s = result.text;
				for(x = s.length ; x < 19 ; x++){
					s = "0" + s;
				}
				$("#txtICCID").val(s);
			}, function (error) {
				mensajes.log({"mensaje": "Scaneo cancelado"});
			}, {
				preferFrontCamera : false, // iOS and Android
				showFlipCameraButton : false, // iOS and Android
				showTorchButton : true, // iOS and Android
				torchOn: false, // Android, launch with the torch switched on (if available)
				saveHistory: true, // Android, save scan history (default false)
				prompt : "Scanea el IMEI", // Android
				resultDisplayDuration: 50, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
				//formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
				orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
				disableAnimations : true, // iOS
				disableSuccessBeep: false // iOS and Android
			});
	});
	
	$("#frmVenta").validate({
		rules: {
			txtIMEI: {
				required: true
			},
			txtICCID: {
				required: true
			},
			selFuerza: {
				required: true
			},
			txtDN: {
				required: true,
				maxlength: 10,
				minlength: 10
			}
		},
		wrapper: 'span',
		onfocusout: false,
		showErrors: function(errorMap, errorList) {
			if (errorList.length > 0){
				campo = $("label[for=" + $(errorList[0].element).attr("id") + "]").text();
				mensajes.log({"mensaje": campo + ": " + errorList[0].message});
				$(errorList[0].element).focus();
			}
		},
		submitHandler: function(form){
			form = $(form);
			
			var obj = new TVenta;
			obj.add({
				fuerza: form.find("#selFuerza").val(),
				iccid: form.find("#txtICCID").val(), 
				imei: form.find("#txtIMEI").val(), 
				dni: form.find("#txtDN").val(),
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if(resp.band){
							mensajes.log({mensaje: "Venta guardada"});
							form[0].reset();
						}else{
							mensajes.alert({"titulo": "Error", mensaje: "No se pudo registrar la venta"});
							console.log(resp.error.message);
						}
					}
				}
			});
		}
	});
	setTimeout (function(){
		listaVentas();
	}, 2000);
	
	
	function listaVentas(){
		db.transaction(function(tx){
			console.log("Obteniendo registro de ventas");
			$("#dvVentas").find(".venta").remove();
			tx.executeSql('select a.*, b.nombre as fuerza from venta a join fuerza b on a.idFuerza = b.idFuerza', [], function(tx, results){
				for(var i = 0 ; i < results.rows.length ; i++){
					venta = $(plantillas["itemVenta"]);
					objVenta = results.rows.item(i);
					setDatos(venta, objVenta);
					$("#dvVentas").append(venta);
				}
			});
		});
	}

	function sincronizarCatalogos(){
		$(".navbar-collapse").removeClass("show");
		blockUI("Estamos obteniendo los datos del servidor");
		$.post(server + "sincronizacion", {
			"usuario": objUsuario.idUsuaro,
			"action": "getCatalogos"
		}, function(datos){
			$.each(datos.fuerza, function(i, el){
				db.transaction(function(tx){
					tx.executeSql('select * from fuerza where idFuerza = ?', [el.idFuerza], function(tx, results){
						if(results.rows.length == 0){
							tx.executeSql('INSERT INTO fuerza (idFuerza, clave, nombre, visible) VALUES (?, ?, ?, ?)', [el.idFuerza, el.clave, el.nombre, el.visible]);
						}else
							tx.executeSql('update fuerza set clave = ?, nombre = ?, visible = ? where idFuerza = ?', [el.clave, el.nombre, el.visible, el.idFuerza]);
					}, errorDB);
				});
			});
			
			unBlockUI();
			mensajes.log({"mensaje": "Se actualizaron " + datos.fuerza.length + " datos"});
		}, "json");
	}
	
	function sincronizarVentas(){
		$(".navbar-collapse").removeClass("show");
		db.transaction(function(tx){
			tx.executeSql('select * from venta where sincronizar = 0', [], function(tx, results){
				var datos = new Array;
				
				for(var i = 0; i < results.rows.length ; i++){
					datos.push(results.rows.item(i));
				}
				var obj = new TVenta;
				obj.send({
					ventas: JSON.stringify(datos),
					usuario: objUsuario.idUsuario,
					fn: {
						before: function(){
							blockUI("Estamos enviando la información al servidor, espera un momento");
						}, after: function(resp){
							unBlockUI();
							if (resp.band){
								mensajes.alert({"mensaje": "Envió terminado"});
								db.transaction(function(tx){
									$.each(resp.ventas, function(i, venta){
									
										tx.executeSql('update venta set idVenta = ? where idElemento = ?', [venta.idVenta, venta.idElemento], null, errorDB);
										console.log(venta);
									});
								});
							}else
								mensajes.alert({"titulo": "Error", "mensaje": "Ocurrió un error en el server"});
						}
					}
				});
			}, errorDB);
		});
	}
}