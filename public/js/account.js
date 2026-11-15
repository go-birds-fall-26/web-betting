import { createChart } from 'https://cdn.jsdelivr.net/npm/lightweight-charts@4.2.0/+esm';
import './tabs.js';

const chartElement = document.getElementById('value-chart');

const chart = createChart(chartElement, {
  autoSize: true,
  layout: {
    // attributionLogo: false,
    background: { color: 'transparent' },
    textColor: '#a89a8a',
    fontFamily: 'IBM Plex Mono, monospace',
  },
  grid: {
    vertLines: { color: '#43362b' },
    horzLines: { color: '#43362b' },
  },
  rightPriceScale: { borderColor: '#43362b' },
  timeScale: { borderColor: '#43362b' },
});

const series = chart.addAreaSeries({
  lineColor: '#129b62',
  topColor: 'rgba(18, 155, 98, 0.4)',
  bottomColor: 'rgba(18, 155, 98, 0)',
});

series.setData(JSON.parse(chartElement.dataset.points));
chart.timeScale().fitContent();
