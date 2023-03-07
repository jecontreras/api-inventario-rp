
module.exports.tarea = async function() {
    var Cron    =  require('./cron')
    Cron = Cron.cron;
    let cron      = new Cron()
    /////////////////////////////////////////////////////////////////////////////////////////////
    let tarea        = Object()
    const moment = require('moment');
    /////////////////////////////////////////////////////////////////////////////////////////////

    tarea        = new Object()
    tarea.nombre = "Reinicio Automatico 12 Horas"
    tarea.tiempo = 24
    tarea.unidad = "hora"
    tarea.log    = false
    tarea.accion = async function(){

        console.log("*******************Reinicio Sistema***************")
        cron.parar()
        process.exit(0)

    }
    cron.AgregarTarea(tarea)

    /////////////////////////////////////////////////////////////////////////////////////////////


    tarea        = new Object()
    tarea.nombre = "Creando inventario 24 Horas!!!"
    tarea.tiempo = 2
    tarea.unidad = "minute"
    tarea.log    = false
    tarea.accion = async function(){

        console.log("*******************creando inventario***************")
        //await inventarioService.init();

    }
    cron.AgregarTarea(tarea)

    async function iniciador(){
        await EstadoguiaServices.init( );
    }
    /*setTimeout(async() => {
      await LogsServices.automaticBill();
    }, 3000);*/
    //iniciador();
    cron.iniciar();
}
