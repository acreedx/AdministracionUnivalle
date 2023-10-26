export interface IProductData {
  id: number
  archivo: string;
  servicio: string;
  titulo: string;
  modulo: string;
  estado: boolean;
  descripcionPublicacion:[
    {
      contenido: string;
    },
    {
      contenido: string;
    },
    {
      contenido: string;
    }
  ];
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

export function convertJSONService(data: any) {
  
  const convertedData: IProductData = {
    id: data[0].identificador,
    archivo: data[0].archivo,
    servicio: data[0].servicio,
    titulo: data[0].titulo,
    estado: data[0].estado,
    modulo: data[0].modulo,
    descripcionPublicacion: data[0].descripcion,
    status: data.estado == true ? "success" : "danger",
  };
  //console.log(convertedData)
  return convertedData;
}

export interface ICrearproducto {
  archivo: string | null;
  serviciosId: number;
  titulo: string;
  id_modulo: number;
  estado: boolean;
  descripcionPublicacion:[
    {
      contenido: string;
    },
    {
      contenido: string;
    },
    {
      contenido: string;
    }
  ];
}

export interface IEditarproducto {
  archivo: string | null;
  titulo: string;
  descripcionPublicacion:[
    {
      id: number
      contenido: string;
    },
    {
      id: number
      contenido: string;
    },
    {
      id: number
      contenido: string;
    }
  ];
}