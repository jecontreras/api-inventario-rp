/**
 * FacturaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const _ = require('lodash');
 const moment = require('moment');

 let Procedures = Object();
 Procedures.getSimple = async( req, res )=>{
  let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Factura, params);
     for(let row of resultado.data ){
        if( row.provedor ) row.provedor = await Provedor.findOne( { where: { id: row.provedor } } );
        row.itemPeers = _.sumBy( ( await FacturaArticulo.find( { where: { factura: row.id, estado: 0 } } ) ), 'cantidad' );
     }
     return res.ok(resultado);
 }
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(Factura, params);
     for(let row of resultado.data ){
        if( row.provedor ) row.provedor = await Provedor.findOne( { where: { id: row.provedor } } );
        row.listFacturaArticulo = await FacturaArticulo.find( { where: { factura: row.id, estado: 0 } });
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
 Procedures.getDetail = async( req, res )=>{
  let result = Object();
  let params = req.allParams();
  let dataFinix = {
    sumPending: 0,
    paymentsTotal: 0
  };
  let querys = { where: { entrada: 0, user:params.user, asentado: true, estado: 0} };
  if( params.provedor ) querys.where.provedor = params.provedor;
  result = await Factura.find( querys ).limit(1000000000);
  dataFinix.sumPending = ( _.sumBy( result, (row)=> ( row.monto - ( row.passMoney || 0 ) ) ) );
  dataFinix.paymentsTotal = ( _.sumBy( result, (row)=> ( row.passMoney || 0 ) ) );
  return res.status(200).send( { status: 200, data: dataFinix } );
 }
 Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let clone = req.allParams();
    let resultado = Object();
    Procedures.validateClient( params.factura );
    resultado = await Procedures.createFactura( params.factura );
    params.id = resultado.id;
    let result = Object();
    for( let row of params.listArticulo ){
        row.factura = resultado.id;
        row.cantidad = row.cantidadSelect;
        row.estado = resultado.estado;
        result = await Procedures.createArticuloFactura( row );
        //console.log("***", row)
    }
    return res.status(200).send( { status:200, data: params } );
 }

 Procedures.validateClient = async( data )=>{
  let resultado = Object();
  resultado = await Clientes.findOne( { nombre: data.nombreCliente } );
  if( resultado ) return resultado;
  else return await Clientes.create( { nombre: data.nombreCliente } );

 }

 Procedures.update = async( req, res )=>{
    let parametros = req.allParams();
    let resultado = Object();
    if( !parametros.id ) return res.status( 200 ).send( { status: 400, data: "Error no se encontro el id"} );
    let data = _.clone( parametros );
    resultado = await Factura.update( { id: data.id }, data ).fetch();
    resultado = resultado[0];
    //console.log("************68", resultado)

    for( let row of parametros.listArticulo || [] ){
      let disabledOff = true;
        if( row.id && row.eliminado == false ) {
          if( resultado.asentado == true ){

            let entrada = 1;
            let texto = "Saliendo articulo";

            const filter = await FacturaArticulo.findOne( { id: row.id });
            let cantidad = 0;
            if( row.cantidadSelect  >= filter.cantidad   ) {
              cantidad = row.cantidadSelect - filter.cantidad;
              entrada = 1;
              texto = "Saliendo articulo de factura ya asentada";
            }
            else {
              cantidad = filter.cantidad - row.cantidadSelect;
              texto = "Devolucion de articulo de factura ya asentada";
              entrada = 0;
            }
            console.log( "91******", texto, "****",cantidad, "****",entrada)
            if( cantidad >= 1 ) {
              if( entrada === 1 ){
                const validate = await Procedures.nextValidador( row );
                if( validate.estatus === false ) disabledOff = false;
              }
              if( disabledOff === true ) {
                console.log("****NO ENTRE!!!!!!", disabledOff)
                await Procedures.CantidadesDs( { valor: cantidad, tipoEntrada: entrada, user: resultado.user, articuloTalla: row.articuloTalla.id, descripcion: texto, asentado: true } );
                await LogsServices.createLog( { txt: `Factura ya asentado y fue editada ${ resultado.codigo } Modificacion de la cantidad ${ row.cantidadSelect } del articulo ${ row.codigo }`} );
              }
            }
          }else await LogsServices.createLog( { txt: `Factura editada ${ resultado.codigo } Modificacion de la cantidad ${ row.cantidadSelect } del articulo ${ row.codigo }`} );
          if( disabledOff == true ) await Procedures.updateFacturaArticulo( { id: row.id, cantidad: row.cantidadSelect } );
        }
        if( row.eliminado == true ) {
          if( resultado.asentado == true ){
            const filter = await FacturaArticulo.findOne( { id: row.id } );
            let entrada = 0;
            let texto = "Devolucion de articulo de factura ya asentada";
            if( filter ) await Procedures.CantidadesDs( { valor: filter.cantidad, tipoEntrada: entrada, user: resultado.user, articuloTalla: row.articuloTalla.id, descripcion: texto, asentado: true } );
          }
          await Procedures.updateFacturaArticulo( { id: row.id, estado: 1 } );
        }
        if( !row.id ) {
            row.factura = resultado.id;
            row.cantidad = row.cantidadSelect;
            row.estado = resultado.estado;
            if( resultado.asentado === true ){
              const validate = await Procedures.nextValidador( row );
              if( validate.estatus === false ) disabledOff = false;
            }
            console.log("********144", disabledOff)
            if( disabledOff === true ){
              const off = await Procedures.createArticuloFactura( row );
              row.id = off.id;
              //console.log("****OFFF109", off, "....", row)
              if( resultado.asentado == true && off ){
                let entrada = 1;
                let texto = "Saliendo articulo de factura ya asentada";
                let cantidad = row.cantidadSelect;
                await Procedures.CantidadesDs( { valor: cantidad, tipoEntrada: entrada, user: resultado.user, articuloTalla: row.articuloTalla.id || row.articuloTalla, descripcion: texto, asentado: true } );
              }
            }
        }
    }
    return res.status(200).send( { status:200, data: parametros } );
 }

 Procedures.nextValidador = async( row )=>{
  let listError = [];
  let populateTalla = await ArticuloTalla.findOne( { id: row.articuloTalla.id } );
  let populateColor = await ArticuloColor.findOne( { id: row.articuloColor.id } );
  if( populateTalla.cantidad < row.cantidadSelect ) listError.push( { articulo: row.articulo.id, data: "Error No tienes suficiente cantidad inventario!!"+ " color " + populateColor.color  + " Talla " + populateTalla.talla + " Cantidad requerida: " + row.cantidadSelect + " Cantidad Inventario " + populateTalla.cantidad  } );
  if( listError.length === 0 ) return {
    estatus: true,
    data: listError
  }
  else return {
      estatus: false,
      data: listError
  };
}

 Procedures.updateFacturaArticulo = async( data )=>{
    return FacturaArticulo.update( { id: data.id }, data );
 }

 Procedures.asentarFactura = async( req, res )=>{
    let params = req.allParams();
    let resultado = Object();
    if( !params.id ) return res.status( 200 ).send(  { status: 400, data: "Error id undefined" } );

    resultado = await Factura.findOne( { where: { id: params.id, asentado: false, estado: 0 } } );
    if( !resultado ) return res.status( 200 ).send( { status: 400, data: "Error no se encontro la factura" } );

    let listArticulos = await FacturaArticulo.find( { where: { factura: resultado.id, estado: 0 } } ).limit( 100 );
    if( resultado.entrada === 1 ){
      console.log("***178", listArticulos);
      let validador = await Procedures.validarCantidades( listArticulos );

      if( !validador.estatus ) return res.status( 200 ).send( { status: 400, data: validador.data } );
    }
    let entrada = resultado.entrada;
    let texto = "Entrando inventario";
    //console.log("*********", resultado)

    for( let row of listArticulos ){
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
        if( row.asentado === false ) await Procedures.CantidadesDs( { valor: row.cantidad, tipoEntrada: entrada, user: resultado.user, articuloTalla: row.articuloTalla, descripcion: texto, asentado: true } );
        await FacturaArticulo.update( { id: row.id }, { asentado:true } );
    }
    await Factura.update( { id: resultado.id }, { asentado: true, fechaasentado: new moment().format("DD/MM/YYYY, h:mm:ss a") } );
    await LogsServices.createLog( { txt: `Factura asentada ${ resultado.codigo } Fecha ${ new Date() }`} );
    return res.status( 200 ).send( { status: 200, data: "Exitoso asentada" } );
 }

 Procedures.validarCantidades = async( listArticulo )=>{
    let listError = Array();
    for( let row of listArticulo ){
        let validador = await ArticuloTalla.findOne( { id: row.articuloTalla } );
        if( !validador ) {
            listError.push( { articulo: row.articulo, data: "Error no encontramos articuloTalla" } );
            continue;
        }
        let populateTalla = await ArticuloTalla.findOne( { id: row.articuloTalla } );
        let populateColor = await ArticuloColor.findOne( { id: row.articuloColor } );
        if( populateTalla.cantidad < row.cantidad ) listError.push( { articulo: row.articulo, data: "Error No tienes suficiente cantidad inventario!!"+ " color " + populateColor.color  + " Talla " + populateTalla.talla + " Cantidad requerida: " + row.cantidad + " Cantidad Inventario " + populateTalla.cantidad  } );
    }
    console.log("******220", listError)
    if( listError.length === 0 ) return {
        estatus: true,
        data: listError
    }
    else return {
        estatus: false,
        data: listError
    };
 }

 Procedures.createFactura = async( data )=>{
    return await Factura.create( data ).fetch();
 }

 Procedures.createArticuloFactura = async( data )=>{
    let querys = {
        factura: data.factura,
        articulo: data.articulo.id || data.articulo,
        articuloTalla: data.articuloTalla.id || data.articuloTalla,
        articuloColor: data.articuloColor.id || data.articuloColor,
        cantidad: data.cantidad,
        precio: data.precio,
        estado: data.estado,
        precioOtras: data.precioOtras,
        precioClienteDrop: data.precioClienteDrop,
        precioLokompro: data.precioLokompro,
        precioArley: data.precioArley,
        precioShipping: data.precioShipping
    };
    return await FacturaArticulo.create( querys ).fetch();
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

 //****PROBLEMAS CON EL ID DE QUIEN LA CREO */
 /*Procedures.statisticsBill = async( req, res )=>{
  let params = req.allParams();
  let result = Object();
  let cacheMan = _.clone( await Cache.leer('facturaArticulo') );
  if( cacheMan.length === 0 ) {
    let querys = {
        where: {
          estado: 0,
          asentado: true,
          //user: params.user,
          createdAt: {
            ">=": moment( params.fecha1 ).format(),
            "<=": moment( params.fecha2 ).format()
          }
        }
    };
    if( params.date ){
      this.querys.where.createdAt = {
            ">=": moment( params.date + "T00:00:00.000Z" ).format(),
            "<=": moment( params.date + "T23:00:00.000Z" ).format()
      };
    }
    result = await FacturaArticulo.find( querys ).populate('factura').populate('articulo');
  }
  else {
    result = cacheMan.filter( row => ( row.estado == 0 && row.asentado === true ) );
    if( params.date ){
      result = result.filter( row => ( row.createdAt >= moment( params.date + "T00:00:00.000Z" ).format() &&  row.createdAt <= moment( params.date + "T23:00:00.000Z" ).format() ) );
    }else{
      result = result.filter( row=> ( row.createdAt >= moment( params.fecha1 ).format() &&  row.createdAt <= moment( params.fecha2 ).format() ) );
    }

    for( let row of result ){
      if( !row.factura.id ) row.factura = ( await Cache.leer('factura') ).find( item => item.id === row.factura );
      if( !row.articuloTalla.id )row.articuloTalla = ( await Cache.leer('articuloTalla') ).find( item => item.id === row.articuloTalla );
    }
  }

  console.log("*****289", result.length );
  let dataEnd = [];
  let postion = 0;
  for( let row of result ){
    try {
      let index = _.findIndex( dataEnd, ['idarticulo', row.articuloTalla.id ]);
      // Validando Precio vendido
      let precio = 0;
      if( row.factura.tipoFactura == 0 ) precio = row.precioOtras * row.cantidad;
      if( row.factura.tipoFactura == 1 ) precio = row.precioClienteDrop * row.cantidad;
      if( row.factura.tipoFactura == 2 ) precio = row.precioShipping * row.cantidad;
      if( row.factura.tipoFactura == 3 ) precio = row.precioLokompro * row.cantidad;
      if( row.factura.tipoFactura == 4 ) precio = row.precioArley * row.cantidad;
      //****************
      //console.log("***326", precio,  row.articuloTalla.id)
      if( index >=0 ) {
        dataEnd[index].cantidad+=  row.cantidad;
        dataEnd[index].precio+=  precio;
      }
      else {
        postion++;
        dataEnd.push( {
          Position: postion,
          idarticulo: row.articuloTalla.id,
          cantidad: row.cantidad,
          precio: ( precio * row.cantidad ), articuloTalla: row.articuloTalla,
          createdAt: row.createdAt
        } );
      }
    } catch (error) { console.log("****335", error)}
  }
  dataEnd = _.orderBy( dataEnd, ['cantidad'],['desc']);
  return res.status(200).send( { status: 200, data: dataEnd } );
 }*/

 Procedures.statisticsBill = async( req, res )=>{
  let params = req.allParams();
  let result = Object();
  let resultFact = _.clone( await Cache.leer('factura') );
  if( params.date ) resultFact = resultFact.filter( row =>  row.fecha == params.date );
  else resultFact = resultFact.filter( row=> ( row.fecha >= moment( params.fecha1 ).format() &&  row.fecha <= moment( params.fecha2 ).format() ) );
  let cacheMan = _.clone( await Cache.leer('facturaArticulo') );
  cacheMan = cacheMan.filter( row => row.estado === 0 );
  let rm = [];
  for( let item of resultFact ){
    rm.push( ...cacheMan.filter( row =>{
      if( row.factura.id ) return ( row.factura.id === item.id ) ;
      else return row.factura === item.id
    } ) );
  }
  //console.log("****368//////////", rm.length, cacheMan.length)
  result = rm;

  for( let row of result ){
    if( !row.factura.id ) row.factura = ( await Cache.leer('factura') ).find( item => item.id === row.factura );
    if( !row.articuloTalla.id )row.articuloTalla = ( await Cache.leer('articuloTalla') ).find( item => item.id === row.articuloTalla );
  }

  console.log("*****289", result.length, "FACTURAS",rm.length );
  let dataEnd = [];
  let postion = 0;
  for( let row of result ){
    try {
      let index = _.findIndex( dataEnd, ['idarticulo', row.articuloTalla.id ]);
      // Validando Precio vendido
      let precio = 0;
      if( row.factura.tipoFactura == 0 ) precio = row.precioOtras * row.cantidad;
      if( row.factura.tipoFactura == 1 ) precio = row.precioClienteDrop * row.cantidad;
      if( row.factura.tipoFactura == 2 ) precio = row.precioShipping * row.cantidad;
      if( row.factura.tipoFactura == 3 ) precio = row.precioLokompro * row.cantidad;
      if( row.factura.tipoFactura == 4 ) precio = row.precioArley * row.cantidad;
      //**************** */
      //console.log("***326", precio,  row.articuloTalla.id)
      if( index >=0 ) {
        dataEnd[index].cantidad+=  row.cantidad;
        dataEnd[index].precio+=  precio;
      }
      else {
        postion++;
        dataEnd.push( {
          Position: postion,
          idarticulo: row.articuloTalla.id,
          cantidad: row.cantidad,
          precio: ( precio * row.cantidad ), articuloTalla: row.articuloTalla,
          createdAt: row.createdAt
        } );
      }
    } catch (error) { console.log("****335", error)}
  }
  dataEnd = _.orderBy( dataEnd, ['cantidad'],['desc']);
  return res.status(200).send( { status: 200, data: dataEnd } );
 }

 Procedures.statisticsBillPlatform = async( req, res )=>{
  let params = req.allParams();
  let result = Array();
  let cacheMan = _.clone( await Cache.leer('factura') );
  let postion = 0;
  let dataEnd = Array();
  result = cacheMan.filter( row => ( row.estado == 0 && row.asentado === true && row.entrada === 1 && row.user === params.user ) );
  if( params.date ) result = result.filter( row =>  row.fecha == params.date );
  else result = result.filter( row=> ( row.fecha >= moment( params.fecha1 ).format() &&  row.fecha <= moment( params.fecha2 ).format() ) );
  //console.log("***361", result.length );
  for( let row of result ){
    try {
      let index = _.findIndex( dataEnd, ['nombreCliente', row.nombreCliente ]);
      if( index >=0 ) {
        dataEnd[index].cantidad+=  1;
        dataEnd[index].precio+=  row.monto;
      }
      else {
        postion++;
        dataEnd.push( { nombreCliente: row.nombreCliente, Position: postion, precio: row.monto  } );
      }
    } catch (error) { console.log("****ERROR 381", error)}
  }
  dataEnd = _.orderBy( dataEnd, ['precio'],['desc']);
  return res.status(200).send( { status: 200, data: dataEnd } );
 }

 module.exports = Procedures;
