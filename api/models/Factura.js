/**
 * Factura.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

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
      defaultsTo: 0 // 0 activo 1 eliminado 2 asentar
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
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

