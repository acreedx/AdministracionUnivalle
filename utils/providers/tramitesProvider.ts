import URL from "utils/demo/api";

class TramitesProvider {
  private createServiceRoute: string = "Servicios/addTramite";
  public async CreateTramite(
    nombre: string,
    moduloId: number,
    imagenUrl: string,
    idCategoria: string,
    nombreReferencia: string,
    numerocel: string,
    tiempoTramite: string,


  ) {
    const newService = await fetch(`${URL.baseUrl}${this.createServiceRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({

        nombre: nombre,
        moduloId: moduloId,
        imagenUrl: imagenUrl,
        idCategoria: idCategoria,

        referenciaAdd: {
          nombre: nombreReferencia,
          numerocel: numerocel,
          estado: true,
        },
        duracionAdd: {
          tiempotramite: tiempoTramite,
          estado: true,
        },


        estado: true,
      }),
    })
    const dataNewService = await newService.json()
    const newServiceId = dataNewService.data.id

    console.log(newServiceId)
    return newServiceId
  }
}
export default new TramitesProvider();
