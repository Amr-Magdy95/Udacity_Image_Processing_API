import supertest from 'supertest';
import app from '../index';
import { imageValidator } from '../validators';
import { resizeImage } from '../services';
import * as path from 'path';

const request = supertest(app);

describe('test endpoint response', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get(
      '/resize?name=santamonica&height=200&width=200'
    );
    expect(response.status).toEqual(200);
  });
});

describe('test image validator', () => {
  describe('tests for url parameters', () => {
    it('testing for empty name', () => {
      expect(() => {
        imageValidator('', '200', '200');
      }).toThrow(new Error('one or more of the parameters is missing'));
    });
    it('testing for empty width', () => {
      expect(() => {
        imageValidator('santamonica', '', '200');
      }).toThrow(new Error('one or more of the parameters is missing'));
    });
    it('testing for empty height', () => {
      expect(() => {
        imageValidator('santamonica', '200', '');
      }).toThrow(new Error('one or more of the parameters is missing'));
    });

    it('testing for validity of height', () => {
      expect(() => {
        imageValidator('santamonica', '200sfsfs', '200');
      }).toThrow(new Error('Invalid height'));
    });
    it('testing for validity of width', () => {
      expect(() => {
        imageValidator('santamonica', '200', '200sfsfs');
      }).toThrow(new Error('Invalid width'));
    });
  });

  it('testing for an image name that doesnt exist in assets/full folder', () => {
    expect(() => {
      imageValidator('dalgamon', '200', '200');
    }).toThrow(new Error('the name you entered is invalid'));
  });
});

describe('testing the image resizing function', () => {
  it('testing whether resizeImage would return the correct path', async () => {
    const name = "santamonica", height= 150, width = 150;
    const newImageName = name + '_' + width + '_' + height;
    const res = await resizeImage(
      name,
      width,
      height,
      newImageName
    );
    expect(res).toEqual('\\thumb\\santamonica_150_150.jpg');
  });
});
