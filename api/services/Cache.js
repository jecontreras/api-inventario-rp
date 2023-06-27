var jwt = require('jsonwebtoken');
const _ = require('lodash');

let Procedures = Object();
let Storage = {
  facturaArticulo: Array(),
  factura: Array(),
  articulo: Array(),
  articuloTalla: Array(),
  logs: Array()
};
Procedures.loadDBS = async(model)=>{
  if( model === 'facturaArticulo') {
    Storage.facturaArticulo = await FacturaArticulo.find();
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>CARGADO FACTURA ARTICULO AL CACHE", Storage.facturaArticulo.length )
  }
  if( model === 'factura') {
    Storage.factura = await Factura.find();
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>CARGADO FACTURA AL CACHE", Storage.factura.length )
  }
  if( model === 'articulo') {
    Storage.articulo = await Articulos.find();
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>CARGADO ARTICULO AL CACHE", Storage.articulo.length )
  }
  if( model === 'articuloTalla') {
    Storage.articuloTalla = await ArticuloTalla.find();
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>CARGADO ARTICULO Talla AL CACHE", Storage.articuloTalla.length )
  }
}

Procedures.leer = async( opt )=>{
    console.log("***QUE LLEGO", opt, Storage.facturaArticulo.length )
    return _.clone( Storage[opt] );
}

Procedures.read = async( id, opt )=>{
    let filtro = Storage[opt].find( row => row.id == id );
    return filtro || {};
}

Procedures.filterProcess= ( cacheMan, params, model )=>{
  let ProcessItem = Object.keys( params.where );
  let dataFinix = cacheMan;
  console.log("***ENTRE Cantidad Lista ");
  if(model === 'products' && params.where.id >=0 ) dataFinix = dataFinix.filter( item=> item.id == params.where.id );
  if(model === 'products' && params.where.pro_categoria >=0 ) dataFinix = dataFinix.filter( item=> item.pro_categoria == params.where.pro_categoria );
  if(model === 'products' && params.where.pro_usu_creacion >=0 ) dataFinix = dataFinix.filter( item=> item.pro_usu_creacion === params.where.pro_usu_creacion );
  if(model === 'products' && params.where.pro_sub_categoria >=0 ) dataFinix = dataFinix.filter( item=> item.pro_sub_categoria === params.where.pro_sub_categoria );
  if(model === 'products' && params.where.pro_stado >=0 ) dataFinix = dataFinix.filter( item=> item.pro_estado === params.where.pro_estado );
  if(model === 'products' && params.where.pro_activo >=0 ) dataFinix = dataFinix.filter( item=> item.pro_activo === params.where.pro_activo );
  if(model === 'products' && params.where.pro_mp_venta >=0 ) dataFinix = dataFinix.filter( item=> item.pro_mp_venta === params.where.pro_mp_venta );
  console.log("**30", dataFinix.length, "REsk",ProcessItem)
  return  dataFinix;
}

Procedures.paginate = (array, page_size, page_number)=>{
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

Procedures.guardar = async( data, opt )=>{
    // let filtro = Storage.find( row => row.user == data.user );
    let filtro = _.findIndex( Storage[opt], [ 'user', data.user ]);
    if( filtro >= 0 ) Storage[opt][filtro] = data;
    else Storage[opt].push( data );
}

Procedures.eliminar = async( id, opt )=>{
    let filtro = Storage[opt].filter( row => row.id !== id );
    Storage[opt] = filtro;
    return filtro;
}

Procedures.editar = async( data, id, opt )=>{
    let filtro = _.findIndex( Storage[opt], [ 'id', id ]);
    if( filtro >= 0 ) return Storage[opt][filtro] = data;
    else return "Error al actualizar";
}

Procedures.validar = async( token ) =>{
    if(!token) return { status:400, data: "Es necesario el token de autenticación" };

    token = token.replace('Bearer ', '');
    //console.log( token , "********", Storage );
    let filtro = Storage.find( row => row.tokens == token );
    if( !filtro ) return { status:401, data: "Token inválido" };


    return new  Promise( resolve =>{
        jwt.verify(token, 'Secret Password', function(err, user) {
            if (err) return resolve({ status:401, data: "Token inválido" });
            else return resolve({ status: 200, data: "Awwwww yeah!!!!" });
        })
    })
}

module.exports = Procedures;
