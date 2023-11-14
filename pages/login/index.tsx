import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { loginUser } from 'pages/api/user'


import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui'
import { GithubIcon, TwitterIcon } from 'icons'

function LoginPage() {
  const router = useRouter();
  const { mode } = useContext(WindmillContext)
  const imgSource = '/assets/img/univalle_background.jpg'

  const [ciUsuario, setCiUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await loginUser(ciUsuario, clave);
      console.log("Inicio de sesión exitoso. Datos del usuario:", userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      router.push("/example");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error.message);
      setCiUsuario('');
      setClave('');
      setErrorMessage("Cédula de identidad o contraseña incorrecta");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="hidden object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Sistema de administracion Univalle
              </h1>
              <Label>
                <span>Cedula de Identidad</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="Ingrese su CI"
                  value={ciUsuario}
                  onChange={(e) => setCiUsuario(e.target.value)}
                />
              </Label>

              <Label className="mt-4">
                <span>Contraseña</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
              </Label>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <Button className="mt-4" block onClick={handleLogin}>
                Ingresar
              </Button>

              <p className="mt-1">
                <Link href="/example/create-account">
                  <a className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                    Crear cuenta Univalle
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
