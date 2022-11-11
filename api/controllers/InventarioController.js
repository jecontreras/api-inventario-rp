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

 Procedures.detalle = async( req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await Inventario.find( { where: { estado: 0 } } );
    resultado = resultado[0];
    resultado.listColor = await ArticuloColor.find( { where: { estado: 0 } } );
    console.log("***************", resultado)
    for( let row of resultado.listColor ){
        row.listTalla = await Procedures.getArticulos( params.color );
    }
    return res.ok( resultado );
 }

 Procedures.getArticulos = async( id )=>{
    let resultado = Array();
    resultado = await ArticuloTalla.find( { where: { estado: 0, listColor: id } } ).limit( 1000000 );
    return resultado;
 }

 module.exports = Procedures;