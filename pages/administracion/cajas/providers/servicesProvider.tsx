import URL from "utils/demo/api";

import { ICajasData, convertJSONListService } from "utils/demo/cajasData";

export class ServicesProvider {
  private getServiceRoute: string = "Servicios/getServicioByModule/";
  private deleteServiceRoute: string = "Servicios/deleteServicio/";
  private restoreServiceRoute: string = "Servicios/restoreServicio/";
  private moduleName: string = "Cajas";
  private services: ICajasData[] = [];
  public async ServicesList(): Promise<ICajasData[]> {
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
  public async DeleteService(id: Number){
    await fetch(`${URL.baseUrl}${this.deleteServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  public async RestoreService(id: Number){
    await fetch(`${URL.baseUrl}${this.restoreServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
