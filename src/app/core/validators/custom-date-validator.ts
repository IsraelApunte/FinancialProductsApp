import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si el valor es vacío o null, no hay error
    }

    const inputDate = new Date(control.value);
    if (isNaN(inputDate.getTime())) {
      return { releaseDateInvalid: true }; // Fecha inválida
    }

    const currentDate = new Date();
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return inputDate >= currentDate ? null : { releaseDateInvalid: true };
  };
}
