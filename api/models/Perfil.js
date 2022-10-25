/**
 * Perfil.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    prf_descripcion:{
      type: 'string'
    },
    prf_usu_actualiz:{
        type: 'string'
    },
    est_clave_int:{
        type: 'number'
    },
    prf_fec_actualiz:{
        type: 'string'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activo 1 eliminado
    }
  },

};

