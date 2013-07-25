
var db = openDatabase ("Fisl14", "1.0", "Fisl14", 65535);

db.transaction (function (transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS qrcode " +
        " (id INTEGER NOT NULL PRIMARY KEY, " +
        "texto varchar(1024), "+
        "tipo varchar(255), " +
        "alternativas varchar(1024), " +
        "acertou boolean, " +
        "pontos INTEGER, " +
		"time timestamp default (strftime('%s', 'now')))"
        

    transaction.executeSql (sql, undefined, function (){ 
      console.log("Table QRCode created");
      
    }, error);
  });

//limpaLS();  
//limpaDB();

function limpaLS() {
	console.log("Limpando LocalStorage!");
	
	window.localStorage.removeItem("email");
	window.localStorage.removeItem("nome");
	window.localStorage.removeItem("telefone");
}

function limpaDB() {
	console.log("Limpando Banco de Dados!");

	db.transaction (function (transaction) {
    var sql = "DELETE FROM qrcode"
    transaction.executeSql (sql, undefined, function (){ 
      console.log("id removido");
      
    }, error);
  });
}

function insertQRCode(id,texto, tipo, pontos,a, callback){
  db.transaction (function (transaction){
    var sql = "insert into qrcode (id,texto,tipo,pontos,alternativas) values (?,?,?,?,?)";
    transaction.executeSql (sql, [id,texto,tipo,pontos,a], function (){
      console.log("qrcode salvo.")
      callback(id);
    
    }, function(t,x){
        console.log(x.message)
    	console.log("qrcode pré-existente")
        callback(id);
    });
  });
}

function updateQRCode(id, acertou){
	console.log('Atualizando qrcode com id = ' + id + ' e acertou = ' + acertou);
  db.transaction (function (transaction){
    var sql = "update qrcode set acertou = ? where id = ?";
    transaction.executeSql (sql, [acertou,id], function (){
      console.log("qrcode atualizado.")
    }, error);
  });
}

function listQRCode(callback){
	var resultado = new Array();
	db.transaction (function (transaction){
	    var sql = "SELECT * FROM qrcode ORDER BY time DESC";	
	    transaction.executeSql (sql, undefined, 
		    function (transaction, result){
	    		if (result.rows.length){
	    			for (var i = 0; i < result.rows.length; i++){
	    				var row = result.rows.item (i);
	    				resultado.push({"id":row.id,"texto":row.texto,"tipo":row.tipo,"pontos":row.pontos, "acertou":row.acertou});
	    			}
	    		}  
	    		
	    		callback(resultado);
	    		
		    }, error);	
	});
}

function getQRCodeById(id,callback){
	
	db.transaction (function (transaction){
	    var sql = "SELECT * FROM qrcode where id=?";	
	    transaction.executeSql (sql, [id], 
		    function (transaction, result){
                console.log("Trouxe resultado da query do getQRCodeById")
                                
	    		if (result.rows.length == 1){
	    			var row = result.rows.item (0);
                    console.log("Mandando o resultado para o callback");
	    			callback({
	    				"id":row.id,
	    				"texto":row.texto,
	    				"tipo":row.tipo,
	    				"alternativas":row.alternativas});
	    		}else{
	    			callback(null);
	    		}
                                
		    }, error);
	});
}



function error (transaction, err){
  console.log("DB error : " + err.message);
  return false;

}
