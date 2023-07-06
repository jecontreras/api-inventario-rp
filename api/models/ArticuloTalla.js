/**
 * ArticuloTalla.js
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
  beforeCreate: async (valuesToSet, proceed)=>{
    console.log("¨¨ËNTRE create")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('articuloTalla');
      flagship = false;
    }
    return proceed();
  },
  beforeUpdate: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('articuloTalla');
      flagship = false;
    }
    return proceed();
  },
  beforeDestroy: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('articuloTalla');
      flagship = false;
    }
    return proceed();
  }

};

