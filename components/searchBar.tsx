import { ChangeEvent, useState, useRef } from "react";
import { Button, Input } from "@roketid/windmill-react-ui";

interface SearchBarProps {
  placeHolder: string;
  searchFunction: Function;
  cleanFunction: Function;
}

function SearchBar({
  placeHolder,
  searchFunction,
  cleanFunction,
}: SearchBarProps) {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCleanFunction = () => {
    cleanFunction();
    if (searchInput.current) searchInput.current.value = "";
  };

  return (
    <div className="mt-2 mb-4 mx-4 flex flex-col gap-y-2 justify-center items-center md:mx-8 md:flex-row">
      <Input
        placeholder={placeHolder}
        onChange={handleChange}
        ref={searchInput}
      />
      <div className="flex gap-2 mx-2 flex-row">
        <Button
          onClick={() => {
            if (search != null) {
              searchFunction(search);
            }
          }}
        >
          Buscar
        </Button>
        <Button onClick={handleCleanFunction}>Limpiar</Button>
      </div>
    </div>
  );
}

export default SearchBar;
