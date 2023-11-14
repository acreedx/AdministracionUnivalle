import URL from "utils/demo/api";
import { IRequirementData } from "utils/demo/requirementData";

export class RequirementsProvider {
  private createRequirementRoute: string = "Requisitos/addRequisito";
  private getRequirementsRoute: string = "Requisitos/getRequisitosByServiceId/";
  private deleteRequirementRoute: string = "Requisitos/deleteRequisito/";
  private requirement: IRequirementData = { id: 0, description: "" };
  private requirementsList: IRequirementData[] = [];
  private updateRequirementRoute = "Requisitos/updateRequisito/";

  public async CreateRequirements(descriptions: string[], servicioId: Number) {
    await descriptions.forEach((e) => {
      fetch(`${URL.baseUrl}${this.createRequirementRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: e,
          serviciosId: servicioId,
          pasos: [],
        }),
      });
    });
  }
  public async UpdateRequirements(
    serviciosId: Number,
    requirements: IRequirementData[],
    requirementsOriginal: IRequirementData[]
  ) {
    await requirements.forEach((e) => {
      if (
        !requirementsOriginal.some((element) => {
          element.id === e.id && e.id != 0;
        })
      ) {
        if (e.id == 0) {
          fetch(`${URL.baseUrl}${this.createRequirementRoute}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              descripcion: e.description,
              serviciosId: serviciosId,
              pasos: [],
            }),
          }).catch((e: any) => {
            throw e;
          });
        } else {
          fetch(`${URL.baseUrl}${this.updateRequirementRoute}${e.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              descripcion: e.description,
              serviciosId: serviciosId,
              pasos: [],
            }),
          }).catch((e: any) => {
            throw e;
          });
        }
      } else {
        fetch(`${URL.baseUrl}${this.deleteRequirementRoute}${e.id}`, {
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
  public async GetRequirement(id: Number): Promise<IRequirementData> {
    await fetch(`${URL.baseUrl}${this.getRequirementsRoute}${id}`)
      .then((res) => res.json())
      .then((res) => {
        this.requirement.id = res.data[0].identificador;
        this.requirement.description = res.data[0].descripcion;
      })
      .catch((e: any) => {
        throw e;
      });
    return this.requirement;
  }
  public async GetRequirementsList(id: Number): Promise<IRequirementData[]> {
    await fetch(`${URL.baseUrl}${this.getRequirementsRoute}${id}`)
      .then((res) => res.json())
      .then((res) => {
        res.data.forEach((e: any) => {
          const tempRequirement: IRequirementData = {
            id: e.identificador,
            description: e.descripcion,
          };
          this.requirementsList.push(tempRequirement);
        });
      })
      .catch((e: any) => {
        throw e;
      });
    return this.requirementsList;
  }
}
