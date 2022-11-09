/**
 * ArticuloLog.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    valorAnterior:{
      type: 'integer'
    },
    valor:{
      type: 'integer'
    },
    valorTotal:{
      type: 'integer'
    },
    tipoEntrada:{
      type: 'integer' // 0 entrada 1 salida
    },
    codigo:{
      type: 'string'
    },
    estado:{
      type: 'integer' // 0 activo // 1 eliminado
    },
    articuloTalla:{
      model: 'articuloTalla'
    },
    articuloLogDetallado:{
      model: 'articuloLogDetallado'
    },
    ordenando:{
      type: 'integer'
   },
   user: {
    model: 'user'
   },
   descripcion:{
    type: 'string'
   }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

