import URL from "utils/demo/api";
import { IRequirementData } from "utils/demo/requirementData";

class RequirementsProvider {
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
  public async CreateSingleRequirement(
    description: string,
    servicioId: Number
  ) {
    fetch(`${URL.baseUrl}${this.createRequirementRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: description,
        serviciosId: servicioId,
        pasos: [],
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async UpdateRequirements(
    serviciosId: Number,
    requirements: IRequirementData[]
  ) {
    const requirementsList: IRequirementData[] = await this.GetRequirementsList(
      serviciosId
    );
    requirements.forEach((e) => {
      if (e.id == 0) {
        this.CreateSingleRequirement(e.description, serviciosId);
      }
    });
    requirementsList.forEach((elements) => {
      requirements.forEach((element) => {
        if (elements.id == element.id) {
          this.UpdateSingleRequirement(
            elements.id,
            element.description,
            serviciosId
          );
        }
      });
    });
    requirementsList
      .filter((elemento1) => {
        return !requirements.some((elemento2) => elemento2.id === elemento1.id);
      })
      .forEach((e) => {
        this.DeleteRequirement(e.id);
      });
  }
  public IsInArray(list: IRequirementData[], obj: IRequirementData): Boolean {
    list.forEach((e) => {
      if (e.id === obj.id) {
        return true;
      }
    });
    return false;
  }
  public async UpdateSingleRequirement(
    requirementID: Number,
    descripcion: string,
    serviciosId: Number
  ) {
    fetch(`${URL.baseUrl}${this.updateRequirementRoute}${requirementID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: descripcion,
        serviciosId: serviciosId,
        pasos: [],
      }),
    }).catch((e: any) => {
      throw e;
    });
  }
  public async DeleteRequirement(id: Number) {
    fetch(`${URL.baseUrl}${this.deleteRequirementRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e: any) => {
      throw e;
    });
  }
  public async GetRequirement(id: Number): Promise<IRequirementData> {
    this.requirement = { id: 0, description: "" };
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
    this.requirementsList = [];
    await fetch(`${URL.baseUrl}${this.getRequirementsRoute}${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data != null) {
          res.data.forEach((e: any) => {
            const tempRequirement: IRequirementData = {
              id: e.identificador,
              description: e.descripcion,
            };
            this.requirementsList.push(tempRequirement);
          });
        }
      })
      .catch((e: any) => {
        throw e;
      });
    return this.requirementsList;
  }
}
export default new RequirementsProvider();
