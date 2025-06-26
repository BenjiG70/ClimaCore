import {
  Component,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';

/**
 * The ErrorComponent displays a visual error screen, styled as a grid-based word search.
 * It dynamically adjusts the layout of grid tiles to maintain a uniform square shape,
 * and sequentially highlights specific tiles with a CSS animation for user feedback.
 */
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements AfterViewInit {

  /**
   * A QueryList containing references to all <li> elements marked with the `#tile` template reference.
   * These tiles represent individual squares in the error word search grid.
   */
  @ViewChildren('tile') tiles!: QueryList<ElementRef<HTMLLIElement>>;

  /**
   * Constructs the component instance and injects the native element reference.
   * @param elRef A reference to the root DOM element of this component, used for querying children.
   */
  constructor(private elRef: ElementRef) {}

  /**
   * Angular lifecycle hook that runs after the component's view and its children have been fully initialized.
   * It ensures all tiles and the word search container have correct dimensions, and triggers
   * the tile highlight animation.
   */
  ngAfterViewInit(): void {
    this.adjustLayout();
    this.animateSelection();
  }

  /**
   * HostListener that listens to browser window resize events.
   * Automatically re-applies the layout logic to ensure the grid remains square and responsive.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.adjustLayout();
  }

  /**
   * Adjusts the height and line-height of each tile to match its width, making them square.
   * Also resizes the main `#wordsearch` container to be a square based on its width.
   *
   * This ensures a visually consistent layout across different screen sizes and prevents layout
   * shifts caused by dynamic resizing or initial render timing differences.
   */
  private adjustLayout(): void {
    const tiles = this.tiles.toArray();

    if (tiles.length > 0) {
      // Use the first tile's width as the base for height and line-height
      const width = tiles[0].nativeElement.offsetWidth + 'px';

      tiles.forEach(tile => {
        tile.nativeElement.style.height = width;
        tile.nativeElement.style.lineHeight = width; // vertical centering
      });

      // Make the wordsearch container a square
      const wordsearch = this.elRef.nativeElement.querySelector('#wordsearch') as HTMLElement;
      if (wordsearch) {
        const width = wordsearch.offsetWidth + 'px';
        wordsearch.style.height = width;
      }
    }
  }

  /**
   * Sequentially adds the CSS class `selected` to a predefined list of tiles.
   * Each tile is targeted by a class name (`one`, `two`, ..., `fifteen`) and highlighted with a staggered delay.
   *
   * This animation simulates a scanning or selection effect on the error grid, enhancing user experience
   * by drawing attention to the visual error pattern.
   *
   * - Delay starts at 1500ms after component view initialization.
   * - Each subsequent tile is selected with an additional 500ms delay.
   */
  private animateSelection(): void {
    const classList = [
      'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'
    ];

    let delay = 1500; // Initial delay before first tile selection
    classList.forEach((className, index) => {
      setTimeout(() => {
        const el = this.elRef.nativeElement.querySelector(`.${className}`);
        if (el) {
          el.classList.add('selected'); // Trigger CSS animation
        }
      }, delay);
      delay += 500; // Increase delay for next tile
    });
  }
}
