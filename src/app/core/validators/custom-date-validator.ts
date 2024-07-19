import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function releaseDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const inputDate = new Date(control.value);
        const currentDate = new Date();
        inputDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return inputDate >= currentDate ? null : { releaseDateInvalid: true };
    };
}