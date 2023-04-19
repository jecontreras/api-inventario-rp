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

Procedures.order = async( req, res )=>{

  let params = req.allParams();
  let result = Object();
  let id = { where: { retunrActions: '643daf867d18640014232b7f'} };
  result = await ReturnArticle.find( id ).limit(10000000)
  //console.log("***114", result, id )
  for( let row of result ){
    let urlTxt = `Devolucion desde la area devolucion! id: ${ row.id } title `;
    let miData = await ArticuloLog.find( { where: { descripcion: urlTxt }, sort: "ordenando ASC" } ).limit( 10000000 );
    for (let i = 0; i < miData.length; i++) {
      if( i === 0 ) continue;
      await ArticuloLog.update( { id: miData[i].id }, { estado: 1 } );
    }
    console.log("******117", miData, urlTxt);

  }
  res.status(200).send({ data: "OK+"})
}

Procedures.orderComplete = async( req, res )=>{
  let params = req.allParams();
  let result = Object();
  /*result = await ArticuloLog.find( { where: { estado: 0 }, sort: "ordenando ASC" } ).limit(1000000);
  let dataFinix = [];
  console.log("****136", result.length)
  for (let item = 0; item < result.length; item++) {
    const element = result[item];
    let filtro = _.findIndex( dataFinix, [ 'articuloTalla', element.articuloTalla ] );
    if( filtro === -1 ) dataFinix.push( { descripcion: "modificacion forzada 1", valor: element.valor, valorAnterior:element.valorAnterior, valorTotal: element.valor, articuloTalla: element.articuloTalla, articuloLogDetallado:element.articuloLogDetallado,
      user: element.user, tipoEntrada: 0, asentado: true
    } );
    else {
      if( element.tipoEntrada == 0 ){
        dataFinix[filtro].valorAnterior= dataFinix[filtro].valorTotal;
        dataFinix[filtro].valorTotal+= element.valor;
        dataFinix[filtro].valor= element.valor;
      }
      else{
        console.log("***RESET", element.valor, "Total", element.valorTotal, "anterior", element.valorAnterior,
        "Valor new", dataFinix[filtro] );
        dataFinix[filtro].valorTotal= Number( dataFinix[filtro].valorTotal - element.valor ) || 0;
      }
    }
  }*/
  /*for( let row of dataFinix ){
    await Procedures.CantidadesDs( { ...row, valor: row.valor, valorTotal: row.valorTotal, tipoEntrada: 3, valorAnterior:  row.valorAnterior } );
  }*/
  result = await ArticuloLogDetallado.find( { where: { /*id: "642372e8d4de390014c9ddbc",*/estado: 0 } } )
  let dataFinix = [];
  for (let item = 0; item < result.length; item++) {
    const element = result[item];
    let JSONDATA = await ArticuloLog.find( { where: { articuloLogDetallado: element.id,  estado: 0 }, sort: "ordenando ASC" } );
    for (let e = 0; e < JSONDATA.length; e++) {
      const key = JSONDATA[e];
      if( e === 0 ){
        dataFinix.push( {...key, valorAnterior: 0, valorTotal: key.valor } );
      }else{
        let format = {
          ...key,
          valorAnterior: dataFinix[e-1].valorTotal,
          valorTotal: 0
        };
        if( key.tipoEntrada == 0 ){
          format.valorTotal = key.valor + format.valorAnterior;
        }else{
          format.valorTotal = ( format.valorAnterior - key.valor ) || 0 ;
          if( format.valorTotal <= 0 ) format.valorTotal = 0;
        }
        if( key.descripcion === 'Asentando iventario manual'){
          console.log("*****162")
          format.valorTotal = format.valor;
        }
        dataFinix.push( format );
      }

      }
      for (let off = 0; off < dataFinix.length; off++) {
        const row = array[off];
        let rm = await ArticuloLog.update( { id: row.id }, row ).fetch();
        if( ( off+1 ) >= dataFinix.length ){
          console.log("**ENTRE ADD TODO")
          let filter = await ArticuloLogDetallado.findOne( { articuloLog: String( row.articuloLogDetallado ) } );
          //console.log("***MODIF", filter.id )
          if( filter ) await ArticuloLogDetallado.update({ id: filter.id },  { valor: row.valor, valorAnterior: row.valorAnterior, valorTotal: row.valorTotal, tipoEntrada: row.tipoEntrada }).fetch()
        }
      }
      dataFinix = [];

    }
    res.status(200).send({data:dataFinix})
  console.log("****FINIX", dataFinix.length);
}

Procedures.CantidadesDs = async( data )=>{
  let datas = {
      valor: data.valor,
      tipoEntrada: data.tipoEntrada,
      articuloTalla: data.articuloTalla,
      user: data.user,
      descripcion: data.descripcion,
      asentado: data.asentado,
      valorAnterior: data.valorAnterior,
      valorTotal: data.valorTotal
    };
    //console.log("****", datas )
    //if (!datas.user || !datas.valor) return "Erro en los parametros";
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

