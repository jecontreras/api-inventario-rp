let  Procedures = Object();

Procedures.init = async( )=>{
    let resultado = Object();
    resultado = await Inventario.create( {
        titulo: "Inventario de todo",
        fecha: new Date(),
        descripcion: "Inventario automatico ",
    });
    return true;
}

module.exports = Procedures;