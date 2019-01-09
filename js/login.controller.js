function callLogin(){
	$("[modulo]").html(plantillas["login"]);
	setPanel();
		
	$("#frmLogin").find("#txtUsuario").focus();
	$("#frmLogin").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtUsuario: {
				required : true,
				email: true
			},
			txtPass: {
				required : true
			}
		},
		wrapper: 'span',
		submitHandler: function(form){
			var obj = new TUsuario;
			
			obj.login({
				usuario: $("#txtUsuario").val(), 
				pass: $("#txtPass").val(),
				fn: {
					before: function(){
						$("#frmLogin [type=submit]").prop("disabled", true);
					},
					after: function(data){
						
						if (data.band == false){
							mensajes.alert({
								"mensaje": data.mensaje == ''?"Tus datos no son válidos":data.mensaje,
								"titulo": "Inicio de sesión"
							});
							$("#frmLogin [type=submit]").prop("disabled", false);
						}else
							location.href = "inicio.html";
					}
				}
			});
		}
	});
}