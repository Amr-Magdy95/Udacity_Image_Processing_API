import fs from 'fs';

export const imageValidator = (name: string, height: string, width: string) => {
  if (!name || !height || !width) {
    throw new Error('one or more of the parameters is missing');
  }
  let intWidth: number = parseInt(width),
    intHeight: number = parseInt(height);
  var regExp = /[a-zA-Z]/g;
  if (isNaN(intWidth) || intWidth <= 0 || regExp.test(width)) {
    throw new Error('Invalid width');
  }

  if (isNaN(intHeight) || intHeight <= 0 || regExp.test(height)) {
    throw new Error('Invalid height');
  }
  // is there an image corresponding to that name?
  if (!fs.existsSync(`./assets/full/${name}.jpg`)) {
    throw new Error('the name you entered is invalid');
  }
  return { intWidth, intHeight };
};
