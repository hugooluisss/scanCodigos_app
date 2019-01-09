TUsuario = function(chofer){
	var self = this;
	self.idUsuario = window.localStorage.getItem("session_scanCodigos");
	self.datos = {};
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.localStorage.getItem("session_scanCodigos")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'clogin', {
			"user": datos.usuario,
			"pass": datos.pass, 
			"action": 'login',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
			else{
				window.localStorage.setItem("session_scanCodigos", resp.datos.usuario);
				self.idUsuario = resp.datos.usuario;
			}
				
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	};
	
	this.getData = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		var usuario = datos.idUsuario == undefined?self.idUsuario:datos.idUsuario;
		
		$.post(server + 'cusuarios', {
			"id": usuario,
			"action": 'getData',
			"movil": true
		}, function(resp){
			self.datos = resp;
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	}
};