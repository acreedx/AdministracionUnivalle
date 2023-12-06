import URL from "utils/demo/api";
import { ITramitesData, convertJSONListService } from "utils/demo/tramitesData";

class TramitesProvider {
  private createServiceRoute: string = "Servicios/addTramite";
  private listTramiteRoute: string = "Servicios/getTramiteByModuleActive/";
  private moduleName: string = "Tramites"
  private tramites: ITramitesData[] = [];

  public async TramitesList(): Promise<ITramitesData[]> {
    this.tramites = [];
    await fetch(`${URL.baseUrl}${this.listTramiteRoute}${this.moduleName}`)
      .then((res) => res.json())
      .catch((e: any) => {
        throw e;
      })
      .then((res) => {
        this.tramites = convertJSONListService(res.data);
      })
      .catch((e: any) => {
        throw e;
      });
    return this.tramites;
  }
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
