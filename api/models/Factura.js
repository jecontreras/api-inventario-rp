/**
 * Factura.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let flagship = false;
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    codigo:{
      type: 'string'
    },
    fecha:{
      type: 'string'
    },
    nombreCliente:{
      type: 'string'
    },
    monto:{
      type: 'integer'
    },
    entrada:{
      type: 'integer',
      defaultsTo: 0 // 0 entrada 1 salida 2 devolucion 3 cambio
    },
    provedor:{
      model: 'provedor'
    },
    qr:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    },
    foto:{
      type: 'string'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activo 1 eliminado  3 devolucion
    },
    user:{
      model: 'user'
    },
    tipoFactura:{
      type: "integer" // 0 permitido 1 normal 5 no asignada
    },
    asentado:{
      type: 'boolean',
      defaultsTo: false
    },
    fechaasentado:{
      type:'string'
    },
    coinFinix:{
      type: 'boolean',
      defaultsTo: false
    },
    passMoney:{
      type: 'integer', // cuanto dinero se abono a esta factura
      defaultsTo: 0
    },
    detailsReturn:{
      type: 'string'
    },
    cdFactura:{
      type: 'string'
    },
    expiration:{
      type: 'string'
    },
    colorP:{
      type: 'string'
    },
    devolucion:{
      type: 'integer',
      defaultsTo: 0  // 0 false 1 cambio / 2 garantia
    },
    priceFleteEntrada:{
      type: 'integer',
    },
    priceFleteSalida:{
      type: 'integer',
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  beforeCreate: async (valuesToSet, proceed)=>{
    console.log("¨¨ËNTRE create")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('factura');
      flagship = false;
    }
    return proceed();
  },
  beforeUpdate: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('factura');
      flagship = false;
    }
    return proceed();
  },
  beforeDestroy: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('factura');
      flagship = false;
    }
    return proceed();
  }

};

