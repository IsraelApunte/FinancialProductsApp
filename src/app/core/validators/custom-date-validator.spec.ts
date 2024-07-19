import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { releaseDateValidator } from './custom-date-validator';


describe('releaseDateValidator', () => {
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = releaseDateValidator();
  });

  it('should return null if the date is today or in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Un día en el futuro
    const control = new FormControl(futureDate.toISOString().split('T')[0]);

    const result = validator(control);

    expect(result).toBeNull();
  });

  // Valid date in the future returns null
  it('should return null when the date is in the future', function () {
    const control = { value: '2099-12-31' } as AbstractControl;
    const validator = releaseDateValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });

  // Invalid date format returns releaseDateInvalid error
  it('should return releaseDateInvalid error when the date format is invalid', function () {
    const control = { value: 'invalid-date' } as AbstractControl;
    const validator = releaseDateValidator();
    const result = validator(control);
    expect(result).toEqual({ releaseDateInvalid: true });
  });

});
