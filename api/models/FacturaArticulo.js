/**
 * FacturaArticulo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

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
  beforeCreate:(valuesToSet, proceed)=>{
    console.log("¨¨ËNTRE create")
    Cache.loadDBS('facturaArticulo');
    return proceed();
  },
  beforeUpdate:(valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    Cache.loadDBS('facturaArticulo');
    return proceed();
  },
  beforeDestroy:(valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    Cache.loadDBS('facturaArticulo');
    return proceed();
  }

};

