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
      row.listColor = await ArticuloColor.find( { where: { articulo: row.id } } ).limit(100);
      for( let key of row.listColor ){
         key.listTalla = await ArticuloTalla.find( { where: { articulo: row.id, listColor: key.id } } ).limit(100);
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
   if( params.articulo.id ) return res.status(400).send( { data:"Error id undefines" } );
   resultado = await Articulos.update( { id: params.articulo.id }, params.articulo );
   for( let row of params.listDetalle ){
      
   }

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
 
 module.exports = Procedures;