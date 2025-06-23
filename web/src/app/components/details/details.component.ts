
import { Component, Input} from '@angular/core';

/**
 * Represents a single dataset used in a chart.
 */
interface StatData {
  /**
   * The label for the dataset (e.g. "Temperature", "Humidity").
   * This will typically appear in the chart legend and tooltips.
   */
  label: string;

  /**
   * An array of numerical values corresponding to the dataset.
   * Each value represents a point on the chart.
   */
  data: number[];
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  /**
   * The sensor object associated with the chart.
   * Can contain metadata or configuration related to the data source.
   */
  @Input() sensor: any;

  /**
   * The data to be displayed in the chart.
   * Can be an array of strings (e.g., labels or values) or an array of `StatData` objects.
   */
  @Input() data: string[] | StatData[] = [];

  /**
   * The type of chart to render.
   * Supports standard chart types like 'bar', 'line', 'scatter', 'bubble', 'pie', 'doughnut', 'polarArea', and 'radar'.
   * Defaults to 'bar' if not specified.
   */
  @Input() style?:
    | 'bar'
    | 'line'
    | 'scatter'
    | 'bubble'
    | 'pie'
    | 'doughnut'
    | 'polarArea'
    | 'radar';

  /**
   * Optional chart configuration options, passed directly to the charting library.
   * Structure depends on the charting library used (e.g., Chart.js).
   */
  @Input() options: any;

  /**
   * Labels corresponding to the data entries.
   * Can be a simple array of strings or an array of `StatData` objects, depending on how the chart interprets labels.
   */
  @Input() labels?: string[] | StatData[];

  /**
   * A hex or CSS color string used for chart styling.
   * If not provided, a default color (`#424242`) is used.
   */
  @Input() chartColor?: string;

  src: any;

  /**
   * Initialize the chart
   */
  ngOnInit() {
    this.updateChart();
  }
  /**
   * if something changes, the charts woll be updated
   */
  ngOnChanges() {
    this.updateChart();
  }

  /**
   * Updates the chart configuration (`this.src`) with the latest data and style settings.
   *
   * - Sets chart labels to `this.labels` or an empty array if none are provided.
   * - Uses `getColorArray()` to assign uniform background and border colors based on the data length.
   * - Sets the border width to 1.
   * - Determines whether the chart should be filled based on the `style` (`'line'` charts are not filled).
   * - Sets the chart type based on `this.style`, defaulting to `'bar'`.
   * - Assigns `this.data` to the datasets field for rendering.
   *
   * This method is typically called after data or style updates to refresh the chart display.
   */
  updateChart() {
    this.src = {
      labels: this.labels || [],
      backgroundColor: this.getColorArray(),
      borderColor: this.getColorArray(),
      borderWidth: 1,
      fill: this.style === 'line' ? false : true,
      type: this.style || 'bar',
      datasets: this.data,
    };
  }
  /**
   * Returns an array of color values to be used in a chart.
   * The length of the array matches the number of data points (`this.data.length`).
   * If no data is available, the array will contain a single entry.
   *
   * Each entry in the array contains the same color, either defined by `this.chartColor`
   * or falling back to the default color `#424242`.
   *
   * @returns {string[]} An array of color strings for use in chart visualizations.
   */
  getColorArray(): string[] {
    const length = this.data?.length || 1;
    return Array(length).fill(this.chartColor || '#424242');
  }
}
