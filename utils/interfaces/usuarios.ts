export interface IRegistrarUsuario{
    ciUsuario:string;
    clave:string;
    nombres:string;
    apellidos:string;
    cargoId:number;
}
export interface IEditarUsuario{
    nombres:string;
    apellidos:string;
    // cargoId:number;
}
export interface IAddPermiso{
  modulo: string | null;
}
export interface IEditarClave{
    newPassword:string;
}
export interface IListarUsuario{
  data:
  [
    {
      ci:string;
      nombres:string;
      apellidos:string;
      cargo:number;
      estado:boolean;
    }
  ]
}
export interface IObtenerUsuario{
  ci:string;
  nombres:string;
  apellidos:string;
  cargo:string;
  estado:boolean;
}
export interface IListarCargos{
  data:
  [
    {
      id:number;
      nombrecargo:string;
      estado:boolean;
    }
  ];
    
}
export interface IListarPermisos{
  modulos:
      [
        {
          id:number;
          modulo:string;
        }
      ]
}
export interface IListarModulos{
  data:
  [
    {
      identificador:number;
      nombre:string;
      estado:boolean;
    }
  ];
}