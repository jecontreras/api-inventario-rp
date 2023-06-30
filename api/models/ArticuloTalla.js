/**
 * ArticuloTalla.js
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
    articulo:{
      model: 'articulos'
    },
    talla:{
      type: 'string'
    },
    cantidad:{
      type: 'integer'
    },
    listColor:{
      model: 'articuloColor'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activo 1 eliminado
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  beforeCreate:(valuesToSet, proceed)=>{
    console.log("¨¨ËNTRE create")
    Cache.loadDBS('articuloTalla');
    return proceed();
  },
  beforeUpdate:(valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    Cache.loadDBS('articuloTalla');
    return proceed();
  },
  beforeDestroy:(valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    Cache.loadDBS('articuloTalla');
    return proceed();
  }

};

