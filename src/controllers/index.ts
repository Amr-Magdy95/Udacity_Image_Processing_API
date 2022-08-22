import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { imageValidator } from '../validators';
import { resizeImage } from '../services';

export const resizeController = async (
  req: express.Request,
  res: express.Response
) => {
  // retrieve url parameters
  interface Query {
    name: string;
    height: string;
    width: string;
  }
  const { name, height, width } = req.query as unknown as Query;

  // validate url param
  try {
    const {intHeight, intWidth} = imageValidator(name, height, width)
    const newImageName = name + '_' + intWidth + '_' + intHeight;

    if (!fs.existsSync('./assets/thumb')) {
        fs.mkdirSync('./assets/thumb');
      }
      if (fs.existsSync(`./assets/thumb/${newImageName}.jpg`)) {
        //if cached display it
        res.render('pages/index', {
          newImage: path.join(
            '/thumb',
            name + '_' + intWidth + '_' + intHeight + '.jpg'
          ),
        });
      } else {
        //if not cached, resize image and save it in thumb
        let newImage = await resizeImage(name, intHeight, intWidth, newImageName);
        res.render('pages/index', { newImage: newImage });
      }

  } catch (error) {
    console.log((error as Error).message);
    res.send((error as Error).message);
  }
};
