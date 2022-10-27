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
     for(let row of resultado.data ){
        if( row.provedor ) row.provedor = await Provedor.findOne( { where: { id: row.provedor } } );
        row.listFacturaArticulo = await FacturaArticulo.find( { where: { factura: row.id } });
        for( let item of  row.listFacturaArticulo ){
            item.articulo = await Articulos.findOne( { id: item.articulo } );
            if( item.articulo ) {
                item.articulo.listColor = await ArticuloColor.find( { where: { articulo: item.articulo.id } } ).limit(100);
                for( let key of item.articulo.listColor ){
                    key.listTalla = await ArticuloTalla.find( { where: { articulo: item.articulo.id, listColor: key.id} } ).limit(100);
                }
            }
            item.articuloTalla = await ArticuloTalla.findOne( { id: item.articuloTalla } );
            item.articuloColor = await ArticuloColor.findOne( { id: item.articuloColor } );
        }
     }
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
        cantidad: data.cantidad
    };
    return await FacturaArticulo.create( querys ).fetch();
 }
 module.exports = Procedures;