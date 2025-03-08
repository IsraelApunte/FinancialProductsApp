import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = ''; // Input to receive the tooltip text
  private tooltipElement!: HTMLElement; // Reference to the tooltip element

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipElement) {
      // Create the tooltip element
      this.tooltipElement = this.renderer.createElement('span');
      this.renderer.appendChild(
        this.tooltipElement,
        this.renderer.createText(this.tooltipText) // Add text to the tooltip
      );

      // Add CSS class for styling
      this.renderer.addClass(this.tooltipElement, 'tooltip');

      // Position the tooltip above the element
      const hostPos = this.el.nativeElement.getBoundingClientRect();
      this.renderer.setStyle(this.tooltipElement, 'top', `${hostPos.top + window.scrollY - 30}px`);
      this.renderer.setStyle(this.tooltipElement, 'left', `${hostPos.left + window.scrollX}px`);

      // Append tooltip to the body
      document.body.appendChild(this.tooltipElement);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      // Remove the tooltip when the mouse leaves
      document.body.removeChild(this.tooltipElement);
      this.tooltipElement = null!;
    }
  }
}
