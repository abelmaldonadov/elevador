const app = new Vue({
    el: '#app',
    data: {
        estado: {msg: 'Correcto', color: 'text-success', valor: true},
        noAuto: {src: 'autos/0-min.png', ini: {}, fin: {}},
        t: 250,

        numPisos: 2,
        numCeldas: 4,
        piso: 1,
        celda: 1,

        autos: [],
        autosLibres: [],
        autosEstacionados: [],  // 8 CELDAS, 4 POR PISO
    },
    methods: {
        estacionarAuto() {
            this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
            this.autoEnEspera.pos = {    // ASIGNAR POSICION INICIAL
                y: this.posSelecionada.y, 
                x: this.posSelecionada.x
            }
            
            if (this.autoEnEspera != this.noAuto) {  // ASIGNAR COORDENADAS DESTINO
                this.autoEnEspera.des = {
                    y: this.posiciones.lib[this.posiciones.lib.length - 1].y, 
                    x: this.posiciones.lib[this.posiciones.lib.length - 1].x
                }
            }

            this.autosEstacionados.push(this.autosLibres.pop())     // EXTRAER Y EMPUJAR A AUTOS ESTACIONADOS
            this.trasladarIn(this.autoEntrante)    // TRASLADAR
        },
        extraerAuto() {
            this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
            this.autoSaliente.des = {    // ASIGNAR COORDENADAS DESTINO
                y: 1,   // REGRESAR AL PRIMER PISO
                x: this.posiciones.lib[0].x
            }

            this.trasladarOut(this.autoSaliente)    // TRASLADAR
        },
        trasladarIn(auto) {
            // IR DE LA POSICION INICIAL A LA POSICION DESTINO
            console.log(auto)
            const move = setInterval(() => {
                if (auto.pos.y > auto.des.y) {
                    this.irAbajo(auto)
                } else if (auto.pos.y < auto.des.y) {
                    this.irArriba(auto)
                } else if (auto.pos.x > auto.des.x) {
                    this.irIzquierda(auto)
                } else if (auto.pos.x < auto.des.x) {
                    this.irDerecha(auto)
                } else {
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                    console.log(this.posiciones)
                    clearInterval(move)
                }
            }, this.t);
        },
        trasladarOut(auto) {
            // IR DE LA POSICION INICIAL A LA POSICION DESTINO
            console.log(auto)
            const move = setInterval(() => {
                if (auto.pos.y > auto.des.y) {
                    this.irAbajo(auto)
                } else if (auto.pos.y < auto.des.y) {
                    this.irArriba(auto)
                } else if (auto.pos.x > auto.des.x) {
                    this.irIzquierda(auto)
                } else if (auto.pos.x < auto.des.x) {
                    this.irDerecha(auto)
                } else {
                    this.autosLibres.push(this.autosEstacionados.splice(this.autosEstacionados.indexOf(auto),1)[0])      // EXTRAER Y EMPUJAR A AUTOS LIBRES NUEVAMENTE
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                    console.log(this.posiciones)
                    clearInterval(move)
                }
            }, this.t);
        },
        irDerecha(auto) {
            auto.pos.x++
        },
        irIzquierda(auto) {
            auto.pos.x--
        },
        irArriba(auto) {
            auto.pos.y++
        },
        irAbajo(auto) {
            auto.pos.y--
        },
        ordenarAutos() {
            this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
            console.log('------')
            
            const paso = setInterval(() => {

                let i = 0
                // auto: for (let i = 0; i < this.autosEstacionados.length; i++) {
                auto: for (auto of this.autosEstacionados) {

                    console.log('auto evaluado => y: '+auto.pos.y +', x: '+ auto.pos.x)

                    if (this.posiciones.lib.map(coo => coo.y+' '+coo.x).indexOf((parseInt(auto.pos.y)+1)+' '+auto.pos.x) != -1) {
                        this.irArriba(auto)
                        console.log(i+': subir')
                        break auto
                    } else {
                        if (this.posiciones.lib.map(coo => coo.y+' '+coo.x).indexOf(auto.pos.y+' '+(parseInt(auto.pos.x)+1)) != -1) {
                            this.irDerecha(auto)
                            console.log(i+': derecha')
                            break auto
                        } else {
                            if (i == this.autosEstacionados.length - 1) {
                                console.log('------')
                                this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                                clearInterval(paso)
                                break auto
                            }else {
                                console.log('siguinete auto')
                                i++
                                continue auto
                            }
                        }
                    }
                }

            }, 3*this.t);
        }
    },
    computed: {
        autoEntrante() {
            if (this.autosEstacionados.length) {
                return this.autosEstacionados[this.autosEstacionados.length - 1]
            }else {
                return false
            }
        },
        autoSaliente() {
            if (this.autosEstacionados.length) {
                for (const i of this.autosEstacionados) {
                    if (i.pos.x == this.posSelecionada.x && i.pos.y == this.posSelecionada.y) {
                        return this.autosEstacionados[this.autosEstacionados.indexOf(i)]     // OBTENER EL INDICE DEL ELEMENTO
                    }
                }
            }
            return false
        },
        autoEnEspera() {
            if (this.autosLibres.length) {
                return this.autosLibres[this.autosLibres.length - 1]
            }else {
                return this.noAuto
            }
        },
        numEstacionados() {     // NÚMERO DE AUTOS ESTACIONADOS
            return this.autosEstacionados.length
        },
        posSelecionada() {      // OBTIENE LA POSICION EN NUM CELDA Y PISO SELECCIONADA POR EL USUARIO
            return {y: this.piso, x: this.celda}
        },
        posiciones() {          // OBTIENE LAS POSICIONES LIBRES Y LAS POSICIONES OCUPADAS EN EL ESTACIONAMIENTO
            let coordenadas = [{y:1,x:1},{y:1,x:2},{y:1,x:3},{y:1,x:4},{y:2,x:1},{y:2,x:2},{y:2,x:3},{y:2,x:4}]
            let posiciones = {lib: [], ocu: []}
            for (const i of this.autosEstacionados) {
                let index = coordenadas.map(coo => coo.y+' '+coo.x).indexOf(i.pos.y+' '+i.pos.x)
                posiciones.ocu.push(coordenadas.splice(index,1)[0])
            }
            posiciones.lib = coordenadas
            return posiciones
        }
    },
    created() {
        fetch('autos.json')     // OBTENER AUTOS
        .then(rpta => rpta.json())
        .then(json => {
            this.autos = json
            this.autosLibres = this.autos
        })
        .catch(() => {
            this.estado = {msg: 'Error al cargar autos', color: 'text-danger', valor: false}
        })
    }
})