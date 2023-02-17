/**
 * MoneyPaymentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
const _ = require('lodash');
Procedures.querys = async (req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(MoneyPayments, params);
    return res.ok(resultado);
}
Procedures.create = async ( req, res )=>{
  const params = req.allParams();
  const clone = _.clone( params );
  let result = Object();
  result = await MoneyPayments.create( params ).fetch();
  for( const item of clone.listMoney ){
    const resultR = await MoneyPaymentsBill.create( {
      coin: item.amountPass,
      description: item.description,
      bill: item.id,
      moneyPayments: result.id,
      remaining: item.remaining || 0
    } ).fetch();
    if( !result.listMoney ) result.listMoney = [];
    result.listMoney.push( resultR );
    let data = { passMoney: item.remaining || 0 };
    if( item.remaining === 0 ) data.coinFinix = true;
    await Factura.update( { id: item.id },  data );
  }
  return res.status( 200 ).send( { status:200, data: result } );
}
module.exports = Procedures;

