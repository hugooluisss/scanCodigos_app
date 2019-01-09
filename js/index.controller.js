function callIndex(){
	//$("[modulo]").html(plantillas["index"]);
	//setPanel();
	callRegistro();
}

function callLogout(){
	try{
		window.localStorage.removeItem("session_scanCodigos");
		location.href = "index.html";
	}catch(error){
		window.localStorage.removeItem("session_scanCodigos");
		location.href = "index.html";
	}
}