/**
 * ArticuloLogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     params.sort = "ordenando ASC";
     resultado = await QuerysServices(ArticuloLog, params);
     return res.ok(resultado);
 }
 module.exports = Procedures;
