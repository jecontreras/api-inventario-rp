/**
 * FacturaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Factura, params);
     return res.ok(resultado);
 }
 Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await Procedures.createFactura( params.factura );
    let result = Object();
    for( let row of params.listArticulo ){
        row.factura = resultado.id;
        result = await Procedures.createArticuloFactura( row );
    }
    return res.status(200).send( { status:200, data: params } );
 }

 Procedures.createFactura = async( data )=>{
    return await Factura.create( data ).fetch();
 }

 Procedures.createArticuloFactura = async( data )=>{
    let querys = {
        factura: data.factura,
        articulo: data.articulo,
        articuloTalla: data.articuloTalla,
        articuloColor: data.articuloColor,
        inventarioEntrada: data.inventarioEntrada,
        inventarioSalida: data.inventarioSalida,
        cantidad: data.cantidad
    };
    return await FacturaArticulo.create( querys ).fetch();
 }
 module.exports = Procedures;