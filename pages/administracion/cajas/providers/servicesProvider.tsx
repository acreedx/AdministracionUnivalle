import URL from "utils/demo/api";

import { ICajasData, convertJSONListService } from "utils/demo/cajasData";

export class ServicesProvider {
  private getServiceRoute: string = "Servicios/getServicioByModule/";
  private moduleName: string = "Cajas";

  public async ServicesList(): Promise<ICajasData[]> {
    let services: ICajasData[] = [];
    await fetch(`${URL.baseUrl}${this.getServiceRoute}${this.moduleName}`)
      .then((res) => res.json())
      .catch((e: any) => {
        throw e;
      })
      .then((res) => {
        services = convertJSONListService(res.data);
      })
      .catch((e: any) => {
        throw e;
      });
    return services;
  }
}
