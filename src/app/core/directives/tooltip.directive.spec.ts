import { TooltipDirective } from './tooltip.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Test component to apply the directive
@Component({
  template: `<button appTooltip="Test Tooltip">Hover me</button>`
})
class TestComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let buttonElement: HTMLElement;
  let directiveInstance: TooltipDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TooltipDirective], // ✅ Import the standalone directive instead of declaring it
      declarations: [TestComponent] // Declare the test component
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    buttonElement = fixture.nativeElement.querySelector('button');

    // Retrieve the directive instance from the button element
    const directiveEl = fixture.debugElement.query((el) => el.nativeElement === buttonElement);
    directiveInstance = directiveEl.injector.get(TooltipDirective);
  });

  it('should create an instance of the directive', () => {
    // Ensure that the directive instance is created successfully
    expect(directiveInstance).toBeTruthy();
  });

  it('should show the tooltip on mouse enter', () => {
    // Simulate a mouseenter event
    buttonElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    // Verify that the tooltip is added to the DOM and contains the correct text
    expect(document.body.querySelector('.tooltip')).toBeTruthy();
    expect(document.body.querySelector('.tooltip')?.textContent).toBe('Test Tooltip');
  });

  it('should remove the tooltip on mouse leave', () => {
    // Simulate a mouseenter event to display the tooltip
    buttonElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(document.body.querySelector('.tooltip')).toBeTruthy();

    // Simulate a mouseleave event to remove the tooltip
    buttonElement.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();

    // Verify that the tooltip is removed from the DOM
    expect(document.body.querySelector('.tooltip')).toBeFalsy();
  });
});
