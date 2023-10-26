import { FC,ChangeEvent } from "react";
import { Input, Label, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
interface ReferenciaInputsProps {
  index:number ;
  valueNombre: string | null;
  valueContacto: string| null;
  identificador:number
  handle: (e: ChangeEvent<HTMLInputElement>,id:number,campo: string) => void;
  hadleDelete: (id:number) => void | null;
}

const ReferenciaInputs: FC<ReferenciaInputsProps> = ({
  index,
  valueNombre,
  valueContacto,
  handle,
  identificador,
  hadleDelete
}) => {
  const isNuevoContacto = identificador === null || identificador < 0;
  return (
    <>
      <div className="text-lg">
        {isNuevoContacto ? "Nuevo Contacto" : `Contacto ${isNuevoContacto ? "" : index + 1}`}
      </div>
      <span>Nombre del Contacto</span>
      <div className="flex">
        <Input
          value={valueNombre === null ? "" : valueNombre}
          placeholder="Escriba el nombre del contacto."
          onChange={(e) => handle(e, identificador, "nombre")}
        />
        <div className=" mx-1" ></div>
        <Input
          value={valueContacto === null ? "" : valueContacto}
          placeholder="Escriba el número del contacto."
          onChange={(e) => handle(e, identificador, "numero")}
        />
        <div className=" mx-1" ></div>
        {isNuevoContacto? <Button size="small" onClick={()=>hadleDelete(identificador)}>-</Button>:null}
      </div>

      <hr className="mt-3" />
    </>
  );
};
export default ReferenciaInputs;
