import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage',
  standalone: true
})
export class DefaultImagePipe implements PipeTransform {
  public defaultImageUrl = '/defaultImage.jpg'; // Ruta de la imagen por defecto

  transform(value: string | null | undefined): string {
    // Verificar si el valor es una URL válida
    if (value && this.isValidUrl(value)) {
      return value; // Si es una URL válida, devolverla
    }

    return this.defaultImageUrl; // Si no es válido, devolver la imagen por defecto
  }

  // Función para verificar si la URL es válida
  private isValidUrl(url: string): boolean {
    try {
      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
        '((([A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\\.)+(?:[A-Z]{2,6}\\.?|[A-Z0-9-]{2,}\\.))' + // dominio
        '|(([0-9]{1,3}\\.){3}[0-9]{1,3})' + // IP
        '|localhost|([A-Z0-9-]+\\.[A-Z]{2,})' + // localhost or custom domain
        '|([A-Z0-9-]+\\.[A-Z0-9-]+))' + // custom domain
        '(\\/[A-Z0-9()@?^=%&:/~+#-]*[A-Z0-9()@?^=%&/~+#-])?', 'i'); // path and query
      return !!pattern.test(url); // Retorna verdadero si es una URL válida
    } catch {
      return false;
    }
  }
}