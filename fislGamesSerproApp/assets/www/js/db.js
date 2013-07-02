
var db = openDatabase ("Fisl14", "1.0", "Fisl14", 65535);

db.transaction (function (transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS qrcode " +
        " (id INTEGER NOT NULL PRIMARY KEY, " +
        "texto varchar(1024), "+
        "tipo varchar(255), " +
        "alternativaA varchar(255), " +
        "alternativaB varchar(255), " +
        "alternativaC varchar(255), " +
        "alternativaD varchar(255), " +
        "acertou boolean, " +
        "pontos INTEGER)" +
//        "pontos INTEGER, " +
//				"time timestamp default (strftime('%s', 'now')))"
        

    transaction.executeSql (sql, undefined, function (){ 
      console.log("Table QRCode created");
      
    }, error);
  });
/*
db.transaction (function (transaction) {
    var sql = "DELETE FROM qrcode"
    transaction.executeSql (sql, undefined, function (){ 
      console.log("id removido");
      
    }, error);
  });
*/
function insertQRCode(id,texto, tipo, pontos,a,b,c,d, callback){
  db.transaction (function (transaction){
    var sql = "insert into qrcode (id,texto,tipo,pontos,alternativaA,alternativaB,alternativaC,alternativaD) values (?,?,?,?,?,?,?,?)";
    transaction.executeSql (sql, [id,texto,tipo,pontos,a,b,c,d], function (){
      console.log("qrcode salvo.")
      callback(id);
    
    }, function(){
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
	    //var sql = "SELECT * FROM qrcode ORDER BY time DESC";	
			var sql = "SELECT * FROM qrcode";	
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
	    		if (result.rows.length == 1){
	    			var row = result.rows.item (0);
	    			callback({
	    				"id":row.id,
	    				"texto":row.texto,
	    				"tipo":row.tipo,
	    				"alternativaA":row.alternativaA,
	    				"alternativaB":row.alternativaB,
	    				"alternativaC":row.alternativaC,
	    				"alternativaD":row.alternativaD});
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
