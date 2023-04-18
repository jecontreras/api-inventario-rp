/**
 * ReturnActionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
const _ = require('lodash');

Procedures.querys = async (req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(ReturnActions, params);
    for( let row of resultado.data ){
      row.listReturnArticle = await ReturnArticle.find( { where: { retunrActions: row.id } } ).populate('articleSize').populate('article');
    }
    return res.ok(resultado);
}

Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let clone = _.clone( params );
    let result = Object();
    result = await ReturnActions.create( params.actions ).fetch();
    if( result === false ) return res.status( 400 ).send( { status: 400, data: "Error no podimos crear la devolucion!!" } );
    await Procedures.createReturnArticle( clone.listArticle, result );
    return res.status( 200 ).send( { status: 200, data: result } );
}

Procedures.handleSettling = async( req, res )=>{
  let params = req.allParams();
  let result = Object();
  result = await ReturnActions.findOne( { id: params.id, asentado: false } );
  if( !result ) return res.status( 400 ).send( { status: 400, data: "Error no encontramos la devolucion!!" } );
  result = await ReturnArticle.find( { where: { retunrActions: result.id, asentado: false } } ).limit( 100000 );
  for( let row of result ){
    const info = await Procedures.createDecisions( row );
    console.log("****34", info );
    await ReturnArticle.update( { id: row.id }, { asentado: true } );
  }
  await ReturnActions.update( params.id , { asentado: true } );
  return res.status( 200 ).send( { status: 200, data: "data Completado" } );
}

Procedures.createReturnArticle = async( listArticle, data )=>{
    let dataFinal = [];
    for( let row of listArticle ){
        const result = await ReturnArticle.create( {
            title: row.title,
            amount: row.cantidadSelect,
            coin: row.coin,
            platform: row.platform,
            decisions: row.decisions,
            article: row.articulo,
            articleSize: row.articuloTalla.id,
            user: row.user,
            price: row.precio,
            retunrActions: data.id
        }).fetch();
        dataFinal.push( result );
    }
    return dataFinal;
}

Procedures.createDecisions = async( data )=>{
    if( data.decisions === 0 ){
        const result = await Procedures.CantidadesDs( {
            valor: data.amount,
            tipoEntrada: 0,
            user: data.user,
            articuloTalla: data.articleSize,
            descripcion: "Devolucion desde la area devolucion! id: "+data.id+" title "+ data.title,
            asentado: true
        } );
        return result;
    }
    if( data.decisions === 1 ){
        const result = await Procedures.CantidadesDs( {
            valor: data.amount,
            tipoEntrada: 1,
            user: data.user,
            articuloTalla: data.articleSize,
            descripcion: "destrucción del producto desde la area devolucion! id: "+data.id+" title "+ data.title,
            asentado: true
        } );
        return result;
    }
    return {data:"completado"};
}

Procedures.CantidadesDs = async( data )=>{
    let datas = {
        valor: data.valor,
        tipoEntrada: data.tipoEntrada,
        articuloTalla: data.articuloTalla,
        user: data.user,
        descripcion: data.descripcion,
        asentado: data.asentado
      };
      //console.log("****", datas )
      if (!datas.user || !datas.valor) return "Erro en los parametros";
      let finix = await PuntosService.validandoEntrada(datas);
      //console.log("******", finix )
      if( !finix ) return false;
      //await Procedures.updateArticuloTalla( { id: datas.articuloTalla, cantidad: finix.valorTotal } );
      return "ok";
}

/*Procedures.update = async( req, res )=>{
  let params = req.allParams();
  let result = Object();

}*/

module.exports = Procedures;

