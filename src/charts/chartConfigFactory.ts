import { IChartBuilderFactory, IChartConfigBuilder } from "./charts";
import { ChartType } from "chart.js";
import { BarChartConfigBuilder } from "./barChartConfigBuilder";
import { PieChartConfigBuilder } from "./pieChartConfigBuilder";


export class ChartConfigurationFactory implements IChartBuilderFactory {
    private builderMap = {
        'pie': () => new PieChartConfigBuilder(),
        'bar': () => new BarChartConfigBuilder()
    }
    create(type: ChartType): IChartConfigBuilder {
        return this.builderMap[type]();
    }
}