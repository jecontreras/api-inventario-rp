/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 var Passwords = require('machinepack-passwords');
 const _ = require('lodash');
 const moment = require('moment');
 let Procedures = Object();
 var jwt = require('jsonwebtoken');
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 Procedures.creacionTokens = async( data )=>{
  let tokenData = {
    username: data.usu_email,
    id: data.id
  };
  return new Promise( async( resolve ) => {
    let token = jwt.sign( tokenData, 'Secret Password', { expiresIn: 60 * 60 * 24 /*expires in 24 hours */ });
    await Cache.guardar( { user: data.id, rol: data.usu_perfil, tokens: token } );
    return resolve( token );
  })
}
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.register = async(req, res)=>{
 
     let params = req.allParams();
   // sails.log.info(26, params);
   if((params.usu_clave !== params.usu_confir) && (!params.usu_usuario && !params.email && !params.usu_nombre)) return res.ok({status: 400, data: "error en el envio de los datos"});
     //   Validando si existe  el usuario
   let user = await User.findOne({where:{usu_email: params.usu_email}});
   if(user) return res.ok({status: 400, data: "error el username ya se encuentra registrado"});
     //   Validando la Contraseña
   let password = await Procedures.encryptedPassword(params.usu_clave);
   if(!password) return res.serverError("password Error");
   params.usu_clave = password;
     //   Rol
   let rol = await Perfil.findOne({prf_descripcion: params.rol || "user"});
   if(!rol) {
     rol = await Perfil.create({prf_descripcion: params.rol || "user"}).fetch();
     if(!rol) return res.ok({status: 400, data: "error al crear el rol"});
   }
   params.usu_perfil = rol.id;
   params.codigo = codigo();
   // Buscando la cabeza o la persona que lo refirio
   params.empresa = await Procedures.getCabeza( params );
   user = await User.create(params).fetch();
   if(!user) return res.badRequest(err);
   user = await User.findOne({id: user.id}).populate('usu_perfil')
   let tokens = await Procedures.creacionTokens( user );
   user.tokens = tokens;
   //let resul = await MensajeService.envios( { subtitulo: "Bienvenido a la plataforma LocomproAqui.com Usuario "+ user.usu_email +"! satisfecho el registro", emails: user.usu_email, creado: "123456", descripcion: "Espero que disfrutes trabajar con nuestra plataforma" });
   let resul = await MensajeService.envios1( user.usu_email , { subtitulo: "Bienvenido a la plataforma LocomproAqui.com Usuario "+ user.usu_usuario +"! satisfecho el registro", emails: user.usu_email, creado: "123456", descripcion: "Espero que disfrutes trabajar con nuestra plataforma" } )
   let result = await Procedures.creacionMensajeNotifi(
     {
       titulo: "Importante",
       descripcion: params.categoriaPerfil == 1 ? "si realiza más de 30 ventas al mes, que finalizen con entrega exitosa tu cuenta de usuario será actualizada con mayor ganancias por cada venta" : "si realiza menos de 30 ventas al mes, que finalicen con entrega exitosa tu cuenta de usuario será actualizada con un menor margen de ganancias por cada venta que realice",
       user: user.id
     }
   );
   return res.ok({status: 200, 'success': true, data: user});
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.creacionMensajeNotifi = async( data )=>{
   let resultado = Object();
   let datas = {
     titulo: data.titulo,
     tipoDe: 2,
     admin: 0,
     descripcion: data.descripcion,
     user: data.user 
   };
   resultado = await Notificaciones.create( datas );
   return true;
 }
 
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //   Codigo
 function codigo(){return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();}
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.getCabeza = async( data ) =>{
   let resultado = Object();
   resultado = await Empresa.find({ id: data.empresa || "bodega1" });
   resultado = resultado[0];
   if( !resultado ) return 1;
   return resultado.id;
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.encryptedPassword = (password) =>{
     return new Promise(resolve=>{
         Passwords.encryptPassword({
             password: password,
           }).exec({
             error: function (err){
               resolve(false)
             },
             success: function (password) {
               resolve(password);
 
             }
         });
     })
 
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.login = async function(req, res){
     User.findOne({usu_email: req.param('usu_email')}).populate('usu_perfil').exec(function(err, user){
         if(err) return res.send({'success': false,'message': 'Peticion fallida','data': err});
         if(!user) return res.send({'success': false,'message': 'Usuario no encontrado','data': user});
         Passwords.checkPassword({
             passwordAttempt: req.param('usu_clave'),
             encryptedPassword: user.usu_clave,
             }).exec({
             error: function (err) {
                 return res.send({'success': false,'message': 'Eror del servidor','data': err});
             },
             incorrect: function () {
                 return res.send({'success': false,'message': 'Contraseña incorrecta'});
             },
             success: async function () {
                 user.password = '';
                 sails.log('User '+ user.id +' has logged in.');
                 let tokens = await Procedures.creacionTokens( user );
                 user.tokens = tokens;
                 return res.send({
                 'success': true,
                 'message': 'Peticion realizada',
                 'data': user
                 });
 
             },
             });
         })
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.cambioPass = async (req, res)=>{
 
   let params = req.allParams();
   let resultado = Object();
   params.password = await Procedures.encryptedPassword(params.password);
   resultado = await User.update({id: params.id},{usu_clave: params.password}).fetch();
   return res.status(200).send( { status:200, data: resultado } );
 
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.olvidopass = async( req, res )=>{
   let resultado = Object();
   let params = req.allParams();
   function codigos() { return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase(); }
   let codigo = codigos();
   console.log("*******", params)
   if( !params.usu_email ) return res.status(400).send( { status: 400, data: "Email undefind" } );
   let user = await User.find( { usu_email: params.usu_email } );
   user = user[0];
   if( !user ) return res.status(400).send( { status: 400, data: "Email no encontrado" } );
   resultado = await MensajeService.envios1( params.usu_email, { subtitulo: "Recuperador Contraseña", descripcion: "Hola "+ user.usu_usuario +"La contraseña por defecto =>>>> "+ codigo + " <<<<= Por favor cambiarla lo mas pronto posible por seguridad"})
   //console.log("*****194******", resultado )
   if( resultado ) {
     await Procedures.nextCambioPss( user.id, codigo );
     return res.status(200).send({ status: 200, data: "Contraseña actualizada" });
   }
   else return res.status(400).send( { status: 400, data: "Contraseña no actualizada" } );
 }
 
 Procedures.nextCambioPss = async( id, passwordTR )=>{
   let resultado = Object();
   let password = await Procedures.encryptedPassword( passwordTR );
   resultado = await User.update({ id: id }, { usu_clave: password });
   return true;
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     // console.log("***", params);
   if( params.where.rolName ) {
     params.where.usu_perfil = await Procedures.getRol( params.where.rolName );
     delete params.where.rolName;
   }
     resultado = await QuerysServices(User, params);
     for(let row of resultado.data){
        if( row.usu_perfil )row.usu_perfil = await Perfil.findOne({ id: row.usu_perfil });
        if( row.empresa ) row.empresa = await Empresa.findOne({ id: row.empresa });
     }
     return res.ok(resultado);
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.querysOn = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     // console.log("***", params);
   if( params.where.rolName ) {
     params.where.usu_perfil = await Procedures.getRol( params.where.rolName );
     delete params.where.rolName;
   }
     resultado = await QuerysServices(User, params);
     return res.ok(resultado);
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.getRol = async( rolName )=>{
   let result = await Perfil.findOne( { prf_descripcion: rolName });
   if( !result ) 0;
   return result.id;
 }
  
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.infoUser = async (req, res)=>{
   let params = req.allParams();
   let resultado = Object();
   let extra = Object();
   if(params.where) params = params.where;
 
   resultado = await User.findOne({ id: params.id });
   if( !resultado ) return res.ok( { status:200, data: resultado } );
   //get de puntos 
   extra = await Puntos.findOne( { where: { usuario: resultado.id }});
   if(!extra) resultado.gananciasRefereridos = 0;
   else resultado.gananciasRefereridos = extra.valor;
 
   //mis ganancias
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_estado: 1, ven_sw_eliminado: 0 } }).limit(10000000000);
   resultado.ganancias = ( _.sumBy( extra, (row)=> row.ven_ganancias ) ) + resultado.gananciasRefereridos;
   //por cobrar
   extra = await Tblcobrar.find( { where: { usu_clave_int: resultado.id, cob_estado: 0 } }).limit(10000000000);
   resultado.cobrado = _.sumBy( extra, (row)=> row.cob_monto );
   //pagado
   extra = await Tblcobrar.find( { where: { usu_clave_int: resultado.id, cob_estado: 1 } }).limit(10000000000);
   resultado.pagado = _.sumBy( extra, (row)=> row.cob_monto );
   // porcobrar y le resta lo pagadao
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_retirado: false, ven_estado: 1, ven_sw_eliminado: 0 } }).limit(10000000000);
   console.log("************2222222", extra )
   //resultado.porcobrado = ( (( _.sumBy( extra, (row)=> row.ven_ganancias ) ) + resultado.gananciasRefereridos) - ( resultado.pagado || 0 ) || 0 );
   resultado.porcobrado = ( (( _.sumBy( extra, (row)=> row.ven_ganancias ) ) + resultado.gananciasRefereridos) || 0 );
   //resultado.porcobrado = resultado.porcobrado >= 0 ? resultado.porcobrado : 0 ;
   console.log( "************", extra.length )
   // devoluciones
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_retirado: false, ven_devolucion: false, ven_estado: 2, ven_sw_eliminado: 0 } }).limit(10000000000);
   resultado.devoluciones = ( _.sumBy( extra, (row)=> 10000 ) );
 
   // Ventas En Despachada y Pendiente
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_retirado: false, ven_devolucion: false, ven_estado: [ 0, 3 ], ven_subVendedor:0, ven_sw_eliminado: 0 } }).limit(10000000000);
   resultado.ventasPendientes = ( _.sumBy( extra, (row)=> row.ven_ganancias ) );
 
   // Ventas Calzado Exitoso
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_devolucion: false, ven_estado: 1, ven_subVendedor:0, ven_sw_eliminado: 0 } }).limit(10000000000);
   resultado.ventasCalzadoVR = ( _.sumBy( extra, (row)=> row.ven_total ) );
   
   // Ventas Calzado Pendiente o Despachado
   extra = await Tblventas.find( { where: { usu_clave_int: resultado.id, ven_retirado: false, ven_devolucion: false, ven_estado: [ 0, 3 ], ven_subVendedor:0, ven_sw_eliminado: 0 } }).limit(10000000000);
   resultado.ventasCalzadoDR = ( _.sumBy( extra, (row)=> row.ven_total ) );
   //Busca el nivel del usuario
   resultado.nivel = await NivelServices.nivelUser( resultado );
   return res.ok( { status:200, data: resultado } );
 }

 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 Procedures.resetiar = async( req, res )=>{
   let params = req.allParams();
   let resultado = Object();
   console.log("***********", params);
   if( !params.usu_email ) return res.status( 400 ).send( { data: "Error email undefined" } );
   resultado = await User.findOne( { usu_email: params.usu_email });
   if( !resultado ) return res.status( 400 ).send( { data: "Usuario no encontrado" } );
   let codigos = codigo()
   let password = await Procedures.encryptedPassword( codigos );
   if ( !password ) return res.ok({ status: 400, data: "password Error" });
   
   let msx = await MensajeService.envios( { subtitulo: "LocomproAqui.com Contraseña nueva", emails: params.usu_email, creado: "123456", descripcion: "Estimado usuario esta es la contraseña nueva para volver a entrar al admin de nuestra plataforma contraseña: " + codigos } );
 
   resultado = await User.update( { id: resultado.id }, {  usu_clave: password } );
   return res.status( 200 ).send( { data: "Completado" } );
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 module.exports = Procedures; 
 