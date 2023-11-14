import URL from "utils/demo/api";

export class UbicacionesProvider {
  private createUbicacionRoute: string = "Ubicaciones/addUbicaciones";
  private GetUbicacionesRoute: string =
    "Ubicaciones/getUbicacionesbyServicioId/";
  private UpdateUbicacionesRoute: string = "Ubicaciones/updateUbicaciones/";
  private deleteUbicacionRoute: string = "Ubicaciones/deleteUbicacion";
  private ubicacionesList: IUbicacionesData[] = [];
  private id_modulo: Number = 2;
  public async CreateUbicaciones(ubicacionces: string[], serviceId: Number) {
    await ubicacionces.forEach((e) => {
      fetch(`${URL.baseUrl}${this.createUbicacionRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: e,
          imagen: "",
          video: "",
          serviciosId: serviceId,
          estado: true,
        }),
      });
    });
  }
  public async UpdateUbicaciones(
    serviciosId: Number,
    ubicaciones: IUbicacionesData[],
    ubicacionesOriginal: IUbicacionesData[]
  ) {
    await ubicaciones.forEach((e) => {
      if (
        !ubicacionesOriginal.some((element) => {
          element.id === e.id && e.id != 0;
        })
      ) {
        if (e.id == 0) {
          fetch(`${URL.baseUrl}${this.createUbicacionRoute}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              descripcion: e.name,
              imagen: "",
              video: "",
              serviciosId: serviciosId,
              id_modulo: this.id_modulo,
              estado: true,
            }),
          }).catch((e: any) => {
            throw e;
          });
        } else {
          fetch(`${URL.baseUrl}${this.UpdateUbicacionesRoute}${e.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              descripcion: e,
              imagen: "",
              video: "",
              serviciosId: serviciosId,
              id_modulo: this.id_modulo,
              estado: true,
            }),
          }).catch((e: any) => {
            throw e;
          });
        }
      } else {
        fetch(`${URL.baseUrl}${this.deleteUbicacionRoute}${e.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((e: any) => {
          throw e;
        });
      }
    });
  }
  public async GetUbicacionesList(
    serviceId: Number
  ): Promise<IUbicacionesData[]> {
    await fetch(`${URL.baseUrl}${this.GetUbicacionesRoute}${serviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.data.forEach((e: any) => {
          const ubicacionTemp: IUbicacionesData = {
            id: e.id,
            name: e.descripcion,
          };
          this.ubicacionesList.push(ubicacionTemp);
        });
      });
    return this.ubicacionesList;
  }
}
