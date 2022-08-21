import express, { Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
const sharp = require('sharp');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('view engine', 'ejs');

app.get('/api', (req: Request, res: Response) => {
  // retrieve url parameters
  interface Query {
    name: string;
    height: string;
    width: string;
  }
  const { name, height, width } = req.query as unknown as Query;

  // validate url param
  try {
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
    const newImageName = name + '_' + intWidth + '_' + intHeight;

    const resizeImage = async () => {
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
        console.log('here');
        const myImg = await fsPromises.readFile(`./assets/full/${name}.jpg`);
        let final = await sharp(myImg)
          .resize(intWidth, intHeight)
          .blur(1)
          .greyscale()
          .jpeg()
          .toBuffer();
        await fsPromises.writeFile(
          `./assets/thumb/${newImageName}.jpg`,
          final,
          {
            flag: 'w+',
          }
        );
        let newImage = path.join('/thumb', newImageName + '.jpg');
        res.render('pages/index', { newImage: newImage });
      }
    };

    resizeImage();
  } catch (error) {
    console.log((error as Error).message);
    res.send((error as Error).message);
  }
});

app.listen(port, () => {
  console.log(`the server has now started listening on port : ${port}`);
});
