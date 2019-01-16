TVenta = function(){
	var self = this;
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		var d = new Date();
		var fecha = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		
		db.transaction(function(tx){
			var result = {};
			tx.executeSql('insert into venta(idVenta, idFuerza, fecha, imei, iccid, dni, sincronizar) values (?, ?, ?, ?, ?, ?, 0)', ["", datos.fuerza, fecha, datos.imei, datos.iccid, datos.dni], function(tx, results){
				result.band = true;
				if (datos.fn.after !== undefined) datos.fn.after(result);
			}, function(tx, err){
				result.band = false;
				result.error = err;
				if (datos.fn.after !== undefined) datos.fn.after(result);
			});
		});
	};
	
	this.send = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'sincronizacion', {
			"ventas": datos.ventas,
			"usuario": datos.usuario,
			"action": 'setVentas',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
				
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	}
};