

let Procedures = Object();
Procedures.restartPuntos = async (resultado, cantidad) => {
    let
        suma = 0,
        map = []
        ;

    for (var i = 0; i < resultado.length; i++) {
        if ((suma + resultado[i].valor) <= cantidad) {
            if (cantidad >= suma) {
                suma += resultado[i].valor;
                map.push(resultado[i]);
            }
        }
    }
    return { retiro: suma, puntos: map };
}

Procedures.validandoEntrada = async( data, opt )=>{
 let resultado = Object();
 let puntoAnt = await Procedures.getPunto( { articuloTalla: data.articuloTalla } );
 if( puntoAnt == false ) puntoAnt = { ordenando:0, valorTotal: 0 };
 if( !data.valor ) return { status: 400, data: "Error en el valor entrante undefined" };
 //data.valor = data.valor - 10;
 //console.log("***27datas", data );
 if( data.tipoEntrada === 0 ) {
    data.valorAnterior = puntoAnt.valorTotal;
    data.tipoEntrada = 0;
    data.valorTotal = parseFloat( ( puntoAnt.valorTotal || 0 ) ) + parseFloat( data.valor );
 }else if( data.tipoEntrada === 3 ){
    data.valorAnterior = puntoAnt.valorTotal;
    data.tipoEntrada = 2;
    data.valorTotal = data.valor;
 }else{
    data.valorAnterior = puntoAnt.valorTotal;
    data.tipoEntrada = 1;
    data.valorTotal = ( parseFloat( ( puntoAnt.valorTotal || 0 ) ) - parseFloat( data.valor ) ) || 0;
    data.valorTotal = data.valorTotal || 0;
 }
 data.ordenando = puntoAnt.ordenando+1;
 data.codigo = codigo();
 resultado = await ArticuloLog.create( data ).fetch();
 //console.log("dataOPt", data);
 data.articuloLog = resultado.id;
 let rm = await Procedures.getPuntosResumen( data );
 if( rm[0]) rm = rm[0];
 //console.log("**** Pasando",rm);
 await ArticuloLog.update( { id: resultado.id }, { articuloLogDetallado: rm.id } )
 //console.log("****Puntos", data)
 await Procedures.updateArticuloTalla( { id: data.articuloTalla, cantidad: data.valorTotal } )
 return resultado;
}

Procedures.updateArticuloTalla = async( data )=>{
    let resultado = Object();
    resultado = await ArticuloTalla.update( { id: data.id }, { cantidad: data.cantidad } );
    return resultado;
 }

Procedures.getPunto = async( data )=>{
    console.log( data );
    let resultado = await ArticuloLog.find( { where: { articuloTalla: data.articuloTalla }, sort: "ordenando DESC" }).limit(1);
    //console.log("Esto es =>>>>>>>>>>", resultado, data );
    resultado = resultado[0];
    if( resultado ) return resultado;
    else return false;
}

Procedures.getPuntosResumen = async( data )=>{
    let resultado = await ArticuloLogDetallado.find( { where: { user: data.user, articuloTalla: data.articuloTalla, estado: 0 }, sort: "createdAt DESC" });
    resultado = resultado[0];
    //console.log("Encontro la data", resultado)
    if( resultado ) return await Procedures.updatePuntosResumen( resultado.id , data );
    else return await Procedures.createPuntosResumen( data );
}

Procedures.updatePuntosResumen = async( id, data )=>{
    // console.log( "***", data );
    let resultado = await ArticuloLogDetallado.update( { id: id }, {
        valorAnteriror: data.valorAnterior,
        valor: data.valor,
        valorTotal: data.valorTotal,
        tipoEntrada: data.tipoEntrada,
        descripcion: data.descripcion
    } ).fetch();
    //console.log( "actualizando", resultado );
    return resultado;
}

Procedures.createPuntosResumen = async( data )=>{
    let resultado = await ArticuloLogDetallado.create( data ).fetch();
    return resultado;
}

function codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
}

module.exports = Procedures;
