import supertest from 'supertest';
import app from '../index';
import { imageValidator } from '../validators';


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

    it("testing for validity of height", () => {
        expect(() => {imageValidator('santamonica', '200sfsfs', '200')}).toThrow( new Error('Invalid height'));
    });
    it("testing for validity of width", () => {
        expect(() => {imageValidator('santamonica', '200', '200sfsfs')}).toThrow( new Error('Invalid width'));
    });

  });

  it('testing for an image name that doesnt exist in assets/full folder', () => {
    expect(() => {
      imageValidator('dalgamon', '200', '200');
    }).toThrow(new Error('the name you entered is invalid'));
  });

});


