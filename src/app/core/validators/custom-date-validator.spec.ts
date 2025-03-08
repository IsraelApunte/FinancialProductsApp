import { FormControl, ValidatorFn } from '@angular/forms';
import { releaseDateValidator } from './custom-date-validator';

describe('releaseDateValidator', () => {
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = releaseDateValidator();
  });


  it('should return null if the date is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const control = new FormControl(futureDate.toISOString().split('T')[0]);

    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should return releaseDateInvalid error if the date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const control = new FormControl(pastDate.toISOString().split('T')[0]);

    const result = validator(control);

    expect(result).toEqual({ releaseDateInvalid: true });
  });

  it('should return releaseDateInvalid error when the date format is invalid', () => {
    const control = new FormControl('invalid-date');
    const result = validator(control);

    expect(result).toEqual({ releaseDateInvalid: true });
  });

  it('should return null when value is empty or null', () => {
    const emptyControl = new FormControl('');
    const nullControl = new FormControl(null);

    expect(validator(emptyControl)).toBeNull();
    expect(validator(nullControl)).toBeNull();
  });
});
