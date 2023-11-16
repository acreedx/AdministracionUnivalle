export function onlyLettersAndNumbers(str: string) {
  return /^[A-Za-z0-9ñáéíóúü -]*$/.test(str);
}

export function onlyLetters(str: string) {
  return /^[A-Za-zñáéíóúü ]*$/.test(str);
}

export function onlyNumbers(str: string) {
  return /^[0-9() -]*$/.test(str);
}

export function validateUbicationString(str: string) {
  return /^[A-Za-z0-9ñáéíóúü -]*$/.test(str);
}

export function validateImg(selectedFile?: File) {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (selectedFile != undefined) {
    let kb = selectedFile.size / 1024;
    let mb = kb / 1024;
    if (!allowedTypes.includes(selectedFile.type)) {
      return 3;
    }
    if (mb > 10) {
      return 2;
    }
  } else {
    return 0;
  }

  return 1;
}

export function validateVideo(selectedFile?: File) {
  const allowedTypes = ["video/mp4", "video/x-m4v", "video/webm"];

  if (selectedFile != undefined) {
    let kb = selectedFile.size / 1024;
    let mb = kb / 1024;
    if (!allowedTypes.includes(selectedFile.type)) {
      return 3;
    }
    if (mb > 200) {
      return 2;
    }
  } else {
    return 0;
  }

  return 1;
}

export function resetDefaultValFlags(flags: any, valueToSet: any) {
  return Object.keys(flags).reduce((acc: any, key: string) => {
    acc[key] = valueToSet;
    return acc;
  }, {});
}

export const checkValidation = (flags: any) => {
  return Object.values(flags).some(
    (value) => value === false || value === undefined
  )
    ? false
    : true;
};

export const checkValidationEdit = (flags: any) => {
  if (Object.values(flags).every((value) => value === undefined)) {
    return 0;
  }
  if (Object.values(flags).some((value) => value === false)) {
    return 2;
  }
  return 1;
};
