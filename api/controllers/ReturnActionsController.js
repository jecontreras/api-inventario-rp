/**
 * ReturnActionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
Procedures.querys = async (req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(ReturnActions, params);
    return res.ok(resultado);
}

Procedures.create = async( req, res )=>{
    let params = req.allParams();
    let result = Object();
    result = await ReturnActions.create( params.actions );
    if( result === false ) return res.status( 400 ).send( { status: 400, data: "Error no podimos crear la devolucion!!" } );
    result = await Procedures.createReturnArticle( params.listArticle );
    return res.status( 200 ).send( { status: 200, data: "completado" } );
}

Procedures.createReturnArticle = async( listArticle )=>{
    const dataFinal = {};
    for( let row of listArticle ){  
        const result = await ReturnArticle.create( {
            title: row.title,
            amount: row.amount,
            coin: row.coin,
            platform: row.platform,
            decisions: row.decisions,
            article: row.article,
            articleSize: row.articleSize,
            user: row.user
        }).fetch();
        const info = await Procedures.createDecisions( result );
        dataFinal = await info;
    }
    return info;
}

Procedures.createDecisions = async( data )=>{
    if( data.decisions === 0 ){
        const result = await Procedures.CantidadesDs( { 
            valor: data.amount, 
            tipoEntrada: 0, 
            user: data.user, 
            articuloTalla: data.articleSize, 
            descripcion: "Devolucion desde la area devolucion! id: "+data.id+" title "+ data.title, 
            asentado: true 
        } );
        return result;
    }
    if( data.decisions === 1 ){
        const result = await Procedures.CantidadesDs( { 
            valor: data.amount, 
            tipoEntrada: 1, 
            user: data.user, 
            articuloTalla: data.articleSize, 
            descripcion: "destrucción del producto desde la area devolucion! id: "+data.id+" title "+ data.title, 
            asentado: true 
        } );
        return result;
    }
    return {data:"completado"};
}
module.exports = Procedures;
