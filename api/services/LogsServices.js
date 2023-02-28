let Procedures = Object();

Procedures.createLog = async( data )=>{
  await Logs.create( data );
  return true;
 }

module.exports = Procedures;
