import { FC,ChangeEvent } from "react";
import { Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
interface HorariosInputsProps {
  index:number;
  valueDia: string | null;
  valueHorarioinicio: string | null;
  valueHorarioFin: string | null;
  idAtencion:number;
  identificador:number
  handle: (e: ChangeEvent<HTMLInputElement>,id:number,campo: string) => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>, id: number, campo: string, diaId: number) => void;
  hadleDelete: (id:number) => void | null;
}

const HorariosInputs: FC<HorariosInputsProps> = ({
  index,
  valueDia,
  valueHorarioinicio,
  valueHorarioFin,
  handle,
  handleSelect,
  identificador,
  idAtencion,
  hadleDelete
}) => {
  const isNuevoContacto = identificador === null || identificador < 0;

  const convertToTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    // Formatear la hora según el formato requerido para input type="time"
    const formattedTime = date.toISOString().slice(11, 16);
    return formattedTime;
  };
  return (
    <>
      <div className="text-lg">
        {isNuevoContacto ? "Nuevo Horario" : `Horario ${isNuevoContacto ? "" : index + 1}`}
      </div>
      <div className="flex items-center">
        <div className="w-1/3 pr-2"> {/* Dividir la fila en dos, ajustar el espacio a la derecha */}
          <span>Día</span>
          <Select
            value={valueDia === null ? "Lunes" : valueDia}
            placeholder="Seleccione el dia"
            onChange={(e) => handleSelect(e, identificador, "nombreDia",idAtencion)}
          >
            <option value={"Lunes"}>Lunes</option>
            <option value={"Martes"}>Martes</option>
            <option value={"Miercoles"}>Miercoles</option>
            <option value={"Jueves"}>Jueves</option>
            <option value={"Viernes"}>Viernes</option>
            <option value={"Sabado"}>Sabado</option>
            <option value={"Domingo"}>Domingo</option>
          </Select>
        </div>
        <div className="w-1/3 pr-2"> {/* Dividir la fila en dos, ajustar el espacio a la derecha */}
          <span>Hora Apertura</span>
          <Input
            type="time"
            value={valueHorarioinicio === null ? "" : valueHorarioinicio}
            placeholder="Escribe el horario de Inicio."
            onChange={(e) => handle(e, identificador, "horaInicio")}
          />
        </div>
        <div className="w-1/3 pl-2"> {/* Dividir la fila en dos, ajustar el espacio a la izquierda */}
          <span>Hora Cierre</span>
          <Input
            type="time"
            value={valueHorarioFin === null ? "" : valueHorarioFin}
            placeholder="Escriba el horario de fin."
            onChange={(e) => handle(e, identificador, "horaFin")}
          />
        </div>
        {isNuevoContacto ? <Button className="mt-4 ml-2" size="small" onClick={() => hadleDelete(identificador)}>-</Button> : null}
      </div>
      <hr className="mt-3" />
    </>
  );
};
export default HorariosInputs;