///////////////////////////////////////////////////////////////////////////
const moment = require("moment")
///////////////////////////////////////////////////////////////////////////

function Cron ()
{    
    this.segundos = 0
    this.tareas   = Array()
    this.intervalo
}

///////////////////////////////////////////////////////////////////////////

Cron.prototype.iniciar = async function(){

    console.log("Cron-> Iniciado")
    this.intervalo = setInterval(()=>{
        this.segundos++ 
        for(let tarea of this.tareas)
        {
            if(this.verificar(tarea.tiempo,tarea.unidad) === true)
            {
                if(tarea.log)console.log(`Cron-> (${new moment().format("DD/MM/YYYY HH:mm:ss") })Ejecutando Tarea: ${tarea.nombre}, Cada ${tarea.tiempo} ${tarea.unidad}`)
                tarea.accion()
            }
        }    
  
    },1000)
}

///////////////////////////////////////////////////////////////////////////

Cron.prototype.parar = function(){
    setTimeout(()=>{
        clearInterval(this.intervalo)
        console.log("Cron-> Detenido")
    },1000)
}

///////////////////////////////////////////////////////////////////////////

Cron.prototype.AgregarTarea = function(tarea){
    console.log(`Cron-> Tarea Agregada (${tarea.nombre})`)
    let tarea_id =  this.tareas.length
        this.tareas.push(tarea)
    return tarea_id
}

///////////////////////////////////////////////////////////////////////////

Cron.prototype.BorrarTarea = function(id){
    console.log("Cron-> Tarea Borrada")
    delete this.tareas[id]
    return true
}

///////////////////////////////////////////////////////////////////////////

Cron.prototype.verificar = function(tiempo,unidad){

    let seg_por_unidad
    let ciclo 
    if(unidad == 'segundo') seg_por_unidad = 1
    if(unidad == 'minuto' ) seg_por_unidad = 60
    if(unidad == 'hora'   ) seg_por_unidad = 3600
    

    ciclo = tiempo * seg_por_unidad
    if( this.segundos % ciclo == 0 )return true
    else return false
}
let Procedures = Object();
Procedures.cron = Cron;
///////////////////////////////////////////////////////////////////////////
module.exports = Procedures;
///////////////////////////////////////////////////////////////////////////