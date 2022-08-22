import { promises as fsPromises } from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export const resizeImage = async (
  name: string,
  intHeight: number,
  intWidth: number,
  newImageName: string
) => {
  const myImg = await fsPromises.readFile(`./assets/full/${name}.jpg`);
  let final = await sharp(myImg)
    .resize(intWidth, intHeight)
    .blur(1)
    .greyscale()
    .jpeg()
    .toBuffer();
  await fsPromises.writeFile(`./assets/thumb/${newImageName}.jpg`, final, {
    flag: 'w+',
  });
  return path.join('/thumb', newImageName + '.jpg');
};
