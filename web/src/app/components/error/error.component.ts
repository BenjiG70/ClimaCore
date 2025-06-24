import {
  Component,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

@ViewChildren('tile') tiles!: QueryList<ElementRef<HTMLLIElement>>;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.adjustLayout();
    this.animateSelection();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustLayout();
  }

  private adjustLayout(): void {
    const tiles = this.tiles.toArray();

    if (tiles.length > 0) {
      const width = tiles[0].nativeElement.offsetWidth + 'px';

      tiles.forEach(tile => {
        tile.nativeElement.style.height = width;
        tile.nativeElement.style.lineHeight = width;
      });

      const wordsearch = this.elRef.nativeElement.querySelector('#wordsearch') as HTMLElement;
      if (wordsearch) {
        const width = wordsearch.offsetWidth + 'px';
        wordsearch.style.height = width;
      }
    }
  }

  private animateSelection(): void {
    const classList = [
      'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'
    ];

    let delay = 1500;
    classList.forEach((className, index) => {
      setTimeout(() => {
        const el = this.elRef.nativeElement.querySelector(`.${className}`);
        if (el) {
          el.classList.add('selected');
        }
      }, delay);
      delay += 500;
    });
  }
}
