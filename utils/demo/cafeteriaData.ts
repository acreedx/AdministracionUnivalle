interface ICafeteriaData {
  Id: number;
  titulo: string; //nombre
  archivo: string; //image

  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

export type { ICafeteriaData };
