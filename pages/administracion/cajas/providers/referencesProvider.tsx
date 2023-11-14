import URL from "utils/demo/api";

export class ReferencesProvider {
  private createReferencesRoute: string = "Referencia/addReferences";
  private updateReferencesRoute: string = "Referencia/UpdateReferences/";
  public async CreateReference(
    encharged: string,
    cellphone: string,
    newServiceId: Number
  ) {
    await fetch(`${URL.baseUrl}${this.createReferencesRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: encharged,
        numerocel: cellphone,
        serviciosId: newServiceId,
        estado: true,
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async UpdateReference(
    id: number,
    encharged: string,
    cellphone: string
  ) {
    await fetch(`${URL.baseUrl}${this.updateReferencesRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: encharged,
        numerocel: cellphone,
        serviciosId: id,
      }),
    });
  }
}
