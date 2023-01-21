/**
 * InventarioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 const _ = require('lodash');

 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Inventario, params);
     for( let row of resultado.data ){
        row.listArticulo = await InventarioEntrada.find( { where: { estado: 0, inventario: row.id } } ).populate( "articulo" ).populate( "articuloTalla" );
     }
     return res.ok(resultado);
 }

 Procedures.detalle = async( req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await Inventario.find( { where: { estado: 0 } } );
    resultado = resultado[0];
    if( !resultado ) return res.ok( { data: 'no existe'} ); 
    resultado.listArticulo = await Articulos.find( { where: { estado: 0, or: [
        {
          codigo: {
            contains: params.codigo || ""
          }
        }] } } ).limit( 1000000 );
    for( let item of resultado.listArticulo ){
        item.cantidad = 0;
        item.listColor = await ArticuloColor.find( { where: { estado: 0, articulo: item.id } } );
        for( let row of item.listColor ){
            console.log("****", row.color)
            row.listTalla = await Procedures.getArticulos( row.id );
            for( let ol of row.listTalla ) {
                item.cantidad+=Number( ol.cantidad || 0 );
                ol.cantidadReal = Number( ol.cantidad || 0 );
            }
        }
    }
    return res.ok( resultado );
 }

 Procedures.getArticulos = async( id )=>{
    let resultado = Array();
    resultado = await ArticuloTalla.find( { where: { estado: 0, listColor: id } } ).limit( 1000000 );
    return resultado;
 }

 Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let result = Object();
    let clon = _.clone( params );
    result = await Inventario.create( clon ).fetch();
    for( let row of params.listArticulo ){
        await InventarioEntrada.create( {
            inventario: result.id,
            articulo: row.articulo,
            cantidadDisponible: row.cantidad,
            cantidadIngresar: row.cantidadReal,
            articuloTalla: row.articuloTalla,
            diferencia: row.diferencia,
            user: row.user
        } );
    }
    return res.status( 200 ).send( { status: 200, data: "Ok"} );
 }

 Procedures.asentar = async( req, res )=>{
    let params = req.allParams();
    let result = Object();
    result = await Inventario.findOne( { id: params.id } );
    if( !result ) return res.status( 200 ).send( { status: 400, data: "Problemas no encontramos el inventario"} );
    for( let row of params.listArticulo ){
        await Procedures.CantidadesDs({
            valor: row.cantidadIngresar,
            articuloTalla: row.articuloTalla,
            user: result.user,
            descripcion: "Asentando iventario manual",
            inventario: result.id
        });
    }
    return res.status( 200 ).send( { status: 200, data: "Ok"} );
 }


 Procedures.CantidadesDs = async( data )=>{
    let datas = {
        valor: data.valor,
        tipoEntrada: 3,
        articuloTalla: data.articuloTalla,
        user: data.user,
        descripcion: data.descripcion,
        inventario: data.id
      };
      //console.log("****", datas )
      if (!datas.user || !datas.valor) return "Erro en los parametros";
      let finix = await PuntosService.validandoEntrada(datas);
      //console.log("******", finix )
      if( !finix ) return false;
      await Procedures.updateInventario( { id: datas.inventario, estado: 2 } );
      return "ok";
 }

 Procedures.updateInventario = async( data )=>{
    let resultado = Object();
    resultado = await Inventario.update( { id: data.id }, { estado: data.estado } );
    return resultado;
 }

 module.exports = Procedures;