/**
 * InventarioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Inventario, params);
     return res.ok(resultado);
 }

 Procedures.inventario = async( req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await ArticuloColor.find( { where: { estado: 0 } } );
    for( let row of resultado ){
        row.listTalla = await Procedures.getArticulos( params.idColor );
    }
    return resultado;
 }

 Procedures.getArticulos = async( data )=>{
    let resultado = Array();
    resultado = await ArticuloTalla.find( { where: { estado: 0, listColor: data.id } } ).limit( 1000000 );
    return resultado;
 }

 module.exports = Procedures;