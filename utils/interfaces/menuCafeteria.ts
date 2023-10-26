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