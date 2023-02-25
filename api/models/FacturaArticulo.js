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

};

