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
    let clone = req.allParams();
    let resultado = Object();
    resultado = await Procedures.createFactura( params.factura );
    params.id = resultado.id;
    let result = Object();
    for( let row of params.listArticulo ){
        row.factura = resultado.id;
        row.cantidad = row.cantidadSelect;
        row.estado = resultado.estado;
        result = await Procedures.createArticuloFactura( row );
        //console.log("***", row)
        let entrada = clone.factura.entrada;
        let texto = "Entrando inventario";
        console.log("*************", resultado)
        if( resultado.estado == 2 ) {
            if( resultado.entrada == 1 ) { 
                texto = "Saliendo articulo";
                entrada = 1;
            }
            if( resultado.entrada == 2 ) { 
                texto = "Devolucion de articulo";
                entrada = 0;
            }
            if( resultado.entrada == 3 ) {
                texto = "Cambio del producto saliendo";
                entrada = 1;
            }
            await Procedures.CantidadesDs( { valor: row.cantidad, tipoEntrada: entrada, user: clone.factura.user, articuloTalla: result.articuloTalla, descripcion: texto } );
        }
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
        cantidad: data.cantidad,
        precio: data.precio,
        estado: data.estado
    };
    return await FacturaArticulo.create( querys ).fetch();
 }

 Procedures.CantidadesDs = async( data )=>{
    let datas = {
        valor: data.valor,
        tipoEntrada: data.tipoEntrada,
        articuloTalla: data.articuloTalla,
        user: data.user,
        descripcion: data.descripcion
      };
      //console.log("****", datas )
      if (!datas.user || !datas.valor) return "Erro en los parametros";
      let finix = await PuntosService.validandoEntrada(datas);
      //console.log("******", finix )
      if( !finix ) return false;
      await Procedures.updateArticuloTalla( { id: datas.articuloTalla, cantidad: finix.valorTotal } );
      return "ok";
 }

 Procedures.updateArticuloTalla = async( data )=>{
    let resultado = Object();
    resultado = await ArticuloTalla.update( { id: data.id }, { cantidad: data.cantidad } );
    return resultado;
 }
 module.exports = Procedures;