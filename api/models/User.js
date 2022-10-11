/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  usu_usuario:{
      type: 'string'
  },
  usu_clave:{
      type: 'string',
      required: true
  },
  usu_nombre:{
      type: 'string'
  },
  usu_fecha_nacimiento:{
      type: 'string'
  },
  codigo:{
      type: 'string'
  },
  usu_email:{
      type: 'string'
  },
  ven_clave_int:{
      type: 'number'
  },
  usu_imagen:{
      type: 'string',
      defaultsTo: "./assets/logo.png"
  },
  usu_color:{
      type: 'string'
  },
  usu_confirmar:{
      type: 'number'
  },
  usu_indicativo: {
      type: 'string'
  },
  usu_telefono:{
      type: 'string'
  },
  usu_documento:{
      type: 'string'
  },
  usu_apellido:{
      type: 'string'
  },
  
  usu_cedula:{
      type: 'string'
  },
  
  usu_perfil:{
      model: 'perfil'
  },
  
  empresa:{
      model: 'empresa'
  },
  
},
  customToJSON: function(){
  return _.omit(this, ['usu_clave', 'salt']);
},

};