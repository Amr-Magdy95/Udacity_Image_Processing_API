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

  try {
    // validate url param -- and test imageValidator
    const { intHeight, intWidth } = imageValidator(name, height, width);
    const newImageName = name + '_' + intWidth + '_' + intHeight;

    if (!fs.existsSync('./assets/thumb')) {
      fs.mkdirSync('./assets/thumb');
    }
    //if cached display it
    if (fs.existsSync(`./assets/thumb/${newImageName}.jpg`)) {
      res.status(200).render('pages/index', {
        newImage: path.join(
          '/thumb',
          name + '_' + intWidth + '_' + intHeight + '.jpg'
        ),
      });
    }
    //if not cached, resize image and save it in thumb
    else {
      // test resizeImage
      let newImage = await resizeImage(name, intHeight, intWidth, newImageName);
      res.status(200).render('pages/index', { newImage: newImage });
    }
  } catch (error) {
    console.log((error as Error).message);
    res.send((error as Error).message);
  }
};
