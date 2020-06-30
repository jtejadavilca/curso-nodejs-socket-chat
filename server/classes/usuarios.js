class Usuarios {
    constructor() {
        this.personas = [];
        this.personasEnSala = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);

        return this.getPersonasPorSala( sala );
    }

    getPersona( id ) {
        let persona = this.personas.filter( p => p.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala( sala ) {
        this.personasEnSala = this.personas.filter(p => p.sala === sala);
        return this.personasEnSala;
    }

    borrarPersona( id ) {
        let personaBorrada = this.getPersona(id);
        if( personaBorrada ) {
            this.personas = this.personas.filter(persona => persona.id != id);
        }
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
};