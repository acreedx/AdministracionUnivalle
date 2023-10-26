import { FC,ChangeEvent } from "react";
import { Input, Label, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
interface RequisitoPasosInputsProps {
  index:number ;
  valueDescripcion: string | null;
  identificador:number;
  identificadorReq:number;
  handle: (e: ChangeEvent<HTMLTextAreaElement>,id:number,pasoId:number,campo: string) => void;
}

const RequisitoPasosInputs: FC<RequisitoPasosInputsProps> = ({
  index,
  valueDescripcion,
  handle,
  identificador,
  identificadorReq,

}) => {
  const isNuevoPaso = identificador === null || identificador < 0;
  return (
    <>
      
      <span>{isNuevoPaso ? "Nueva Descripción" : `Descripción ${isNuevoPaso ? "" : index + 1}`}</span>
      <div className="flex">
        <Textarea 
        value={valueDescripcion === null ? "" : valueDescripcion}
        rows={3} 
        placeholder="Ingresa los requisitos del servicio." 
        onChange={(e) => handle(e,identificadorReq ,identificador,"nombre")}
        />
        <hr className=" mt-3"/>
        <div className=" mx-1 h-1/2" ></div>

      </div>

      <hr className="mt-3" />
    </>
  );
};
export default RequisitoPasosInputs;
