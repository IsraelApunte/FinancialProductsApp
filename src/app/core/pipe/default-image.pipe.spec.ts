import { DefaultImagePipe } from './default-image.pipe';

describe('DefaultImagePipe', () => {
  let pipe: DefaultImagePipe;

  beforeEach(() => {
    pipe = new DefaultImagePipe();
  });

  it('create an instance', () => {
    const pipe = new DefaultImagePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the same URL when the URL is valid', () => {
    const validUrl = 'https://www.example.com/image.jpg';
    const result = pipe.transform(validUrl);
    expect(result).toBe(validUrl);
  });

  it('should return default image when the URL is null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('/defaultImage.jpg');
  });

  it('should return default image when the URL is undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('/defaultImage.jpg');
  });

  it('should return default image when the URL is "xxxx"', () => {
    const result = pipe.transform('xxxx');
    expect(result).toBe('/defaultImage.jpg');
  });

  it('should return default image when the URL is invalid', () => {
    const invalidUrl = 'invalid-url';
    const result = pipe.transform(invalidUrl);
    expect(result).toBe('/defaultImage.jpg');
  });
});
