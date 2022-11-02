/**
 * ArticulosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 const _ = require('lodash');
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Articulos, params);
     for( let row of resultado.data ){
      row.categoria = await Categoria.findOne( { id: row.categoria } );
      row.subcategoria = await Categoria.findOne( { id: row.subcategoria } );
      row.listColor = await ArticuloColor.find( { where: { articulo: row.id, estado: 0 } } ).limit(100);
      row.cantidad = 0;
      for( let key of row.listColor ){
         key.listTalla = await ArticuloTalla.find( { where: { articulo: row.id, listColor: key.id, estado:0 } } ).limit(100);
         for( let item of key.listTalla ) row.cantidad+=Number( item.cantidad || 0 );
      }
     }
     return res.ok(resultado);
 }

 Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await Procedures.createArticulo( params.articulo );
    let result = Object();
    for( let row of params.listDetalle ){
       let ml = _.clone(row);
        ml.articulo = resultado.id;
        result = await Procedures.createArticuloColor( ml );
        for( let item of row.listTalla){
            let ms = _.clone(item);
            ms.articulo = resultado.id;
            ms.listColor = result.id;
            await Procedures.createArticuloTalla( ms );
        }
    }
    return res.ok(resultado);
 }

 Procedures.update = async( req, res )=>{
   let resultado = Object();
   let params = req.allParams();
   
   if( !params.articulo.id ) return res.status(400).send( { data:"Error id undefines" } );
   //console.log("****+", params.articulo)
   resultado = await Articulos.update( { id: params.articulo.id }, params.articulo )
   let result = Object();
   for( let row of params.listDetalle ){
      //console.log("****51", row)
      if( row.id ) await Procedures.updateArticuloColor( { id: row.id, codigo: row.codigo, color: row.color, estado: row.estado, articulo: row.articulo } );
      else {
         row.articulo = params.id;
         result = await Procedures.createArticuloColor( { color: row.color, codigo: row.codigo, articulo: row.articulo } );
         row.id = result.id;
      }
      if( row.estado == 1 ) await Procedures.reloadArticuloTalla( { articulo: row.articulo, listColor: row.id } );
      for( let item of row.listTalla ){
         if( row.estado == 1 ) item.estado = 1;
         if( item.id ) await Procedures.updateArticuloTalla( { id: item.id, codigo: item.codigo, talla: item.talla, cantidad: item.cantidad, estado: item.estado } );
         else {
            item.articulo = params.id;
            item.listColor = result.id || row.id;
            //console.log("****54", item)
            let finix = await Procedures.createArticuloTalla( { talla: item.talla, codigo: item.codigo, cantidad: item.cantidad, articulo: item.articulo, listColor: item.listColor} );
            item.id = finix.id;
            
         }
      }
   }

   return res.status(200).send( { status:200, data: params } );

 }

 Procedures.createArticulo = async( data )=>{
    let resultado = Object();
    resultado = await Articulos.create( data ).fetch();
    return resultado;
 }

 Procedures.createArticuloColor = async( data )=>{
    return await ArticuloColor.create( data ).fetch();
 }

 Procedures.createArticuloTalla = async( data )=>{
    return await ArticuloTalla.create( data ).fetch();
 }

 Procedures.updateArticuloColor = async( data )=>{
   return await ArticuloColor.update( { id: data.id }, data );
 }

 Procedures.reloadArticuloTalla = async( data )=>{

   let resultado = await ArticuloTalla.find( { where: { articulo: data.articulo, listColor: data.listColor } } );
   //console.log("************", resultado, data );
   for ( let row of resultado ){
      row.estado = 1;
      await Procedures.updateArticuloTalla( row );
   }
 }

 Procedures.updateArticuloTalla = async( data )=>{
   console.log("***RL", data )
   return await ArticuloTalla.update( { id: data.id }, data );
 }
 
 module.exports = Procedures;