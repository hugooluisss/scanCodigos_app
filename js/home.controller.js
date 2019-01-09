function callHome(){
	console.info("Llalmando a home");
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
	
	$("#btnSincronizarCatalogos").click(function(){
		sincronizarCatalogos();
	});
}

function sincronizarCatalogos(){
	$.post(server + "sincronizacion", {
		"usuario": objUsuario.idUsuaro,
		"action": "getCatalogos"
	}, function(datos){
		$.each(datos.fuerza, function(i, el){
			db.transaction(function(tx){
				tx.executeSql('select * from fuerza where idFuerza = ?', [el.idFuerza], function(){
					console.log("tabla tienda creada");
				}, errorDB);
			});
		});
	}, "json");
}