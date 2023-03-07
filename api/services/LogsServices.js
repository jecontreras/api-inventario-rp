let Procedures = Object();
const moment = require('moment');

Procedures.createLog = async( data )=>{
  await Logs.create( data );
  return true;
}

Procedures.automaticBill = async()=>{
  let result = Array();
  result = await Factura.find( { where: { entrada: 0, asentado: true, /*coinFinix:false */} } ).limit(100000);
  console.log("***12", result)
  for( let item of result ){
    var date_1 = new Date( new moment( item.fechaasentado ).format("YYYY-DD-MM") );
    var date_2 = new Date( new moment( ).format("YYYY-MM-DD") );

    var day_as_milliseconds = 86400000;
    var diff_in_millisenconds = date_2 - date_1;
    var diff_in_days = diff_in_millisenconds / day_as_milliseconds;

    //if( diff_in_days >=  10 )
    console.log( "***23",diff_in_days);
  }
}

module.exports = Procedures;
