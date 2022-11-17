/**
 * ArticuloTallaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let Procedures = Object();
 Procedures.querys = async (req, res)=>{
     let params = req.allParams();
     let resultado = Object();
     resultado = await QuerysServices(ArticuloTalla, params);
     for( let row of resultado.data ){
        row.articulo = await Articulos.findOne( { id: row.articulo } );
        row.listColor = await ArticuloColor.findOne( { id: row.listColor  });
     }
     return res.ok(resultado);
 }
 module.exports = Procedures;