const app = new Vue({
    el: '#app',
    data: {
        estado: {msg: 'Correcto', color: 'text-success', valor: true},
        noAuto: {src: 'assets/stop-min.jpg', ini: {}, fin: {}},
        t: 250,

        numPisos: 2,
        numCeldas: 4,
        piso: 1,
        celda: 1,
        progreso: 100,

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
                // x: this.posiciones.lib[0].x
                x: this.autoSaliente.pos.x
            }

            this.trasladarOut(this.autoSaliente)    // TRASLADAR
        },
        trasladarIn(auto) {
            // IR DE LA POSICION INICIAL A LA POSICION DESTINO
            console.log(auto)

            const move = setInterval(() => {
                if (auto.pos.x > auto.des.x) {
                    this.irIzquierda(auto)
                } else if (auto.pos.x < auto.des.x) {
                    this.irDerecha(auto)
                }else if (auto.pos.y > auto.des.y) {
                    this.irAbajo(auto)
                } else if (auto.pos.y < auto.des.y) {
                    this.irArriba(auto)
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
                    this.ordenarAutos()
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
            const paso = setInterval(() => {
                let i = 0
                auto: for (const auto of this.autosEstacionados) {
                    if (this.posiciones.lib.map(coo => coo.y+' '+coo.x).indexOf(auto.pos.y+' '+(parseInt(auto.pos.x)+1)) != -1) {   // HORIZONTAL
                        this.irDerecha(auto)
                        break auto
                    } else {
                        if (this.posiciones.lib.map(coo => coo.y+' '+coo.x).indexOf((parseInt(auto.pos.y)+1)+' '+auto.pos.x) != -1) {   // VERTICAL
                            this.irArriba(auto)
                            break auto
                        } else {
                            if (i == this.autosEstacionados.length - 1) {
                                this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                                clearInterval(paso)
                                break auto
                            }else {
                                i++
                                continue auto
                            }
                        }
                    }
                }
            }, 2*this.t);
        },
        trasladarIzquierda() {
            if (!this.hayAutoIzquierda) {
                this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
                let index = this.posiciones.ocu.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+this.posSelecionada.x)
                console.log(index)
                let auto = this.autosEstacionados[index]
                setTimeout(() => {
                    console.log(auto)
                    this.irIzquierda(auto)
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                }, 2*this.t);
            }
        },
        trasladarDerecha() {
            if (!this.hayAutoDerecha) {
                this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
                let index = this.posiciones.ocu.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+this.posSelecionada.x)
                console.log(index)
                let auto = this.autosEstacionados[index]
                setTimeout(() => {
                    console.log(auto)
                    this.irDerecha(auto)
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                }, 2*this.t);
            }
        },
        trasladarArriba() {
            if (!this.hayAutoArriba) {
                this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
                let index = this.posiciones.ocu.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+this.posSelecionada.x)
                console.log(index)
                let auto = this.autosEstacionados[index]
                setTimeout(() => {
                    console.log(auto)
                    this.irArriba(auto)
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                }, 2*this.t);
            }
        },
        trasladarAbajo() {
            if (!this.hayAutoAbajo) {
                this.estado = {msg: 'Por favor espere...', color: 'text-warning', valor: false}
                let index = this.posiciones.ocu.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+this.posSelecionada.x)
                console.log(index)
                let auto = this.autosEstacionados[index]
                setTimeout(() => {
                    console.log(auto)
                    this.irAbajo(auto)
                    this.estado = {msg: 'Correcto', color: 'text-success', valor: true}
                }, 2*this.t);
            }
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
        posSelecionada() {      // OBTIENE LA POSICION EN NUM CELDA Y PISO SELECCIONADA POR EL USUARIO
            return {y: parseInt(this.piso), x: parseInt(this.celda)}
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
        },
        hayAutoIzquierda() {
            let coordenadas = [{y:1,x:1},{y:1,x:2},{y:1,x:3},{y:1,x:4},{y:2,x:1},{y:2,x:2},{y:2,x:3},{y:2,x:4}]
            for (const i of this.autosEstacionados) {   // RETIRO LAS POSICIONES OCUPADAS AL TOTAL DE POSICIONES
                let index = coordenadas.map(coo => coo.y+' '+coo.x).indexOf(i.pos.y+' '+i.pos.x)
                coordenadas.splice(index,1)[0]
            }
            if (coordenadas.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+(this.posSelecionada.x - 1)) != -1) {
                return false    // LA CELDA ESTÁ VACIA
            } else {
                return true
            }
        },
        hayAutoDerecha() {
            let coordenadas = [{y:1,x:1},{y:1,x:2},{y:1,x:3},{y:1,x:4},{y:2,x:1},{y:2,x:2},{y:2,x:3},{y:2,x:4}]
            for (const i of this.autosEstacionados) {   // RETIRO LAS POSICIONES OCUPADAS AL TOTAL DE POSICIONES
                let index = coordenadas.map(coo => coo.y+' '+coo.x).indexOf(i.pos.y+' '+i.pos.x)
                coordenadas.splice(index,1)[0]
            }
            if (coordenadas.map(coo => coo.y+' '+coo.x).indexOf(this.posSelecionada.y+' '+(this.posSelecionada.x + 1)) != -1) {
                return false    // LA CELDA ESTÁ VACIA
            } else {
                return true
            }
        },
        hayAutoArriba() {
            let coordenadas = [{y:1,x:1},{y:1,x:2},{y:1,x:3},{y:1,x:4},{y:2,x:1},{y:2,x:2},{y:2,x:3},{y:2,x:4}]
            for (const i of this.autosEstacionados) {   // RETIRO LAS POSICIONES OCUPADAS AL TOTAL DE POSICIONES
                let index = coordenadas.map(coo => coo.y+' '+coo.x).indexOf(i.pos.y+' '+i.pos.x)
                coordenadas.splice(index,1)[0]
            }
            if (coordenadas.map(coo => coo.y+' '+coo.x).indexOf((this.posSelecionada.y + 1)+' '+this.posSelecionada.x) != -1) {
                return false    // LA CELDA ESTÁ VACIA
            } else {
                return true
            }
        },
        hayAutoAbajo() {
            let coordenadas = [{y:1,x:1},{y:1,x:2},{y:1,x:3},{y:1,x:4},{y:2,x:1},{y:2,x:2},{y:2,x:3},{y:2,x:4}]
            for (const i of this.autosEstacionados) {   // RETIRO LAS POSICIONES OCUPADAS AL TOTAL DE POSICIONES
                let index = coordenadas.map(coo => coo.y+' '+coo.x).indexOf(i.pos.y+' '+i.pos.x)
                coordenadas.splice(index,1)[0]
            }
            if (coordenadas.map(coo => coo.y+' '+coo.x).indexOf((this.posSelecionada.y - 1)+' '+this.posSelecionada.x) != -1) {
                return false    // LA CELDA ESTÁ VACIA
            } else {
                return true
            }
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