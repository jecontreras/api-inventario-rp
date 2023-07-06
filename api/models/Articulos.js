/**
 * Articulos.js
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
      type: 'string',
      unique: true
    },
    titulo:{
      type: 'string'
    },
    slug:{
      type: 'string'
    },
    imagen:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    },
    empresa:{
      model: 'empresa'
    },
    qr:{
      type:'string'
    },
    categoria:{
      model: 'categoria'
    },
    subcategoria:{
      model: 'categoria'
    },
    precioClienteDrop:{
      type: 'integer'
    },
    precioCompra:{
      type: 'integer'
    },
    precioOtras:{
      type: 'integer'
    },
    precioShipping:{
      type: 'integer'
    },
    precioLokompro:{
      type: 'integer'
    },
    precioArley:{
      type: 'integer'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activo 1 eliminado
    },
    user:{
      model: 'user'
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
      await Cache.loadDBS('articulo');
      flagship = false;
    }
    return proceed();
  },
  beforeUpdate: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('articulo');
      flagship = false;
    }
    return proceed();
  },
  beforeDestroy: async (valuesToSet, proceed)=>{
    console.log("¨¨UPDATE")
    if( flagship === false ){
      flagship = true;
      await Cache.loadDBS('articulo');
      flagship = false;
    }
    return proceed();
  }

};

