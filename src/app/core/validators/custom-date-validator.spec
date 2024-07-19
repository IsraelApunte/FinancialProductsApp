import { FormControl } from '@angular/forms';
import { releaseDateValidator } from './custom-date-validator';

describe('releaseDateValidator', () => {
  it('should return null if the release date is today or in the future', () => {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    const todayControl = new FormControl(today, [releaseDateValidator()]);
    const futureControl = new FormControl(futureDateString, [releaseDateValidator()]);

    expect(todayControl.errors).toBeNull();
    expect(futureControl.errors).toBeNull();
  });

  it('should return releaseDateInvalid error if the release date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    const pastControl = new FormControl(pastDateString, [releaseDateValidator()]);

    expect(pastControl.errors).toEqual({ releaseDateInvalid: true });
  });

  it('should handle invalid date input gracefully', () => {
    const invalidDateControl = new FormControl('invalid-date', [releaseDateValidator()]);

    expect(invalidDateControl.errors).toEqual({ releaseDateInvalid: true });
  });
});