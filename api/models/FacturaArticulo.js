/**
 * FacturaArticulo.js
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
    factura:{
      model: 'factura',
      required: true
    },
    articulo:{
      model: 'articulos',
      required: true
    },
    articuloTalla:{
      model: 'articuloTalla',
      required: true
    },
    articuloColor:{
      model: 'articuloColor',
      required: true
    },
    logs:{
      model: 'logs'
    },
    cantidad: {
      type: 'integer',
      required: true
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activo 1 eliminado
    },
    precio:{
      type: 'integer',
      required: true
    },
    precioOtras:{
      type: 'integer',
      defaultsTo: 0
    },
    precioClienteDrop:{
      type: 'integer',
      defaultsTo: 0
    },
    precioLokompro:{
      type: 'integer',
      defaultsTo: 0
    },
    precioArley:{
      type: 'integer',
      defaultsTo: 0
    },
    precioShipping:{
      type: 'integer',
      defaultsTo: 0
    },
    asentado:{
      type: 'boolean',
      defaultsTo: false
    },
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
      await Cache.loadDBS('facturaArticulo');
      flagship = false;
    }
    return proceed();
  },
  beforeUpdate: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('facturaArticulo');
      flagship = false;
    }
    return proceed();
  },
  beforeDestroy: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('facturaArticulo');
      flagship = false;
    }
    return proceed();
  }

};

