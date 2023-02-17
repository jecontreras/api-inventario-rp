/**
 * MoneyPaymentsBillController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
Procedures.querys = async (req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(MoneyPaymentsBill, params);
    for( const row of resultado.data ){
      row.bill = await Factura.findOne( { id: row.bill } );
    }
    return res.ok(resultado);
}
module.exports = Procedures;

