import { ChartConfiguration, ChartType } from "chart.js";

interface IChartBuilderFactory {
    create(type: ChartType): IChartConfigBuilder
}

interface IChartConfigBuilder {
    create(request: ChartRequest): ChartConfiguration
}

interface IChartGenerator {
    request: ChartRequest,
    generate(config: ChartConfiguration): any
}

interface ChartRequest {
    type: ChartType,
    height: number,
    width: number,
    padding: number,
    data: ChartEntry[],
}

interface ChartEntry {
    xAxisData: string,
    yAxisData: number,
    label: string
}