import { uploadFile } from "../../firebase/config";
import URL from "utils/demo/api";
import { IUbicacionesData } from "utils/demo/ubicacionesData";

class UbicacionesProvider {
  private createUbicacionRoute: string = "Ubicaciones/addUbicaciones";
  private GetUbicacionesRoute: string =
    "Ubicaciones/getUbicacionesbyServicioId/";
  private UpdateUbicacionesRoute: string = "Ubicaciones/updateUbicaciones/";
  private deleteUbicacionRoute: string = "Ubicaciones/deleteUbicacion/";
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
  public async CreateSingleUbicacion(
    description: string,
    imagen: string,
    serviceId: Number
  ) {
    fetch(`${URL.baseUrl}${this.createUbicacionRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: description,
        imagen: imagen,
        video: "",
        serviciosId: serviceId,
        id_modulo: this.id_modulo,
        estado: true,
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async UpdateSingleUbicacion(
    description: string,
    serviciosId: Number,
    ubicacionId: Number,
    imagen: string
  ) {
    fetch(`${URL.baseUrl}${this.UpdateUbicacionesRoute}${ubicacionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: description,
        imagen: imagen,
        video: "",
        serviciosId: serviciosId,
        id_modulo: this.id_modulo,
        estado: true,
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async UpdateUbicaciones(
    serviciosId: Number,
    ubicaciones: IUbicacionesData[],
    serviceImgArray: any[]
  ) {
    const ubicacionesList: IUbicacionesData[] = await this.GetUbicacionesList(
      serviciosId
    );
    ubicaciones.map(async (e, index) => {
      if (e.id == 0) {
        const imgUrlNew: string = await uploadFile(
          serviceImgArray[index],
          "ubicaciones/imagenes/"
        );
        console.log(imgUrlNew);
        await this.CreateSingleUbicacion(e.name, imgUrlNew, serviciosId);
      }
    });
    ubicacionesList.map((elements, index) => {
      ubicaciones.map(async (element, index) => {
        if (elements.id == element.id) {
          if (serviceImgArray[index] == null) {
            this.UpdateSingleUbicacion(
              element.name,
              serviciosId,
              element.id,
              element.imagen
            );
          } else {
            const imgUrlNews: string = await uploadFile(
              serviceImgArray[index],
              "ubicaciones/imagenes/"
            );
            this.UpdateSingleUbicacion(
              element.name,
              serviciosId,
              element.id,
              imgUrlNews
            );
          }
        }
      });
    });
    ubicacionesList
      .filter((elemento1) => {
        return !ubicaciones.some((elemento2) => elemento2.id === elemento1.id);
      })
      .forEach((e) => {
        this.DeleteSingleUbicacion(e.id);
      });
  }
  public async DeleteSingleUbicacion(id: Number) {
    fetch(`${URL.baseUrl}${this.deleteUbicacionRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e: any) => {
      throw e;
    });
  }
  compareById = (a: IUbicacionesData, b: IUbicacionesData): number => {
    return a.id - b.id;
  };
  public async GetUbicacionesList(
    serviceId: Number
  ): Promise<IUbicacionesData[]> {
    this.ubicacionesList = [];
    await fetch(`${URL.baseUrl}${this.GetUbicacionesRoute}${serviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data != null) {
          res.data.forEach((e: any) => {
            const ubicacionTemp: IUbicacionesData = {
              id: e.identificador,
              name: e.descripcion,
              imagen: e.imagen,
            };
            this.ubicacionesList.push(ubicacionTemp);
          });
          this.ubicacionesList.sort(this.compareById);
        }
      })
      .catch((e: any) => {
        throw e;
      });
    return this.ubicacionesList;
  }
}
export default new UbicacionesProvider();
