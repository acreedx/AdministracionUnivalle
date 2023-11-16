import URL from "utils/demo/api";

import {
  ICajasData,
  convertJSONListService,
  convertJSONService,
} from "utils/demo/cajasData";

class ServicesProvider {
  private moduleName: string = "Cajas";
  private moduleId: Number = 2;
  private getServiceRoute: string = "Servicios/getServicioByModule/";
  private getServiceByIdRoute = "Servicios/getServicioById/";
  private createServiceRoute: string = "Servicios/addServicio";
  private deleteServiceRoute: string = "Servicios/deleteServicio/";
  private restoreServiceRoute: string = "Servicios/restoreServicio/";
  private updateServiceRoute: string = "Servicios/updateServicio/";

  private services: ICajasData[] = [];
  public async ServicesList(): Promise<ICajasData[]> {
    this.services = [];
    await fetch(`${URL.baseUrl}${this.getServiceRoute}${this.moduleName}`)
      .then((res) => res.json())
      .catch((e: any) => {
        throw e;
      })
      .then((res) => {
        this.services = convertJSONListService(res.data);
      })
      .catch((e: any) => {
        throw e;
      });
    return this.services;
  }
  public async GetOneService(id: Number): Promise<ICajasData> {
    let empty: ICajasData = {
      id: 0,
      name: "",
      ubicacionId: 0,
      ubicacion: "",
      enchargedId: 0,
      imagenUrl: "",
      encharged: "",
      cellphone: "",
      status: "danger",
    };
    await fetch(`${URL.baseUrl}${this.getServiceByIdRoute}${id}`)
      .then((res) => res.json())
      .then((res) => {
        empty = convertJSONService(res.data[0]);
      })
      .catch((e: any) => {
        throw e;
      });
    return empty;
  }
  public async UpdateService(name: string, imgUrl: string, id: Number) {
    await fetch(`${URL.baseUrl}${this.updateServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        imagenUrl: imgUrl,
        idCategoria: null,
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async CreateService(name: string, imgUrl: string): Promise<Number> {
    const service = await fetch(`${URL.baseUrl}${this.createServiceRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        moduloId: this.moduleId,
        imagenUrl: imgUrl,
        idCategoria: null,
      }),
    }).catch((e: any) => {
      throw e;
    });
    const data = await service.json();
    if (data.data != null) {
      return data.data.id;
    }
    throw "Ya existe un servicio con ese nombre";
  }
  public async DeleteService(id: Number) {
    await fetch(`${URL.baseUrl}${this.deleteServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e: any) => {
      throw e;
    });
  }
  public async RestoreService(id: Number) {
    await fetch(`${URL.baseUrl}${this.restoreServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e: any) => {
      throw e;
    });
  }
}
export default new ServicesProvider();
