/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../../ftr_provider_context';

export default function ({ getPageObjects }: FtrProviderContext) {
  const { visualize, lens, visChart, visEditor } = getPageObjects([
    'visualize',
    'lens',
    'visChart',
    'visEditor',
  ]);

  describe('Heatmap', function describeIndexTests() {
    before(async () => {
      await visualize.initTests();
    });

    beforeEach(async () => {
      await visualize.navigateToNewAggBasedVisualization();
      await visualize.clickHeatmapChart();
      await visualize.clickNewSearch();
    });

    it('should show the "Edit Visualization in Lens" menu item if no X-axis was specified', async () => {
      await visChart.waitForVisualizationRenderingStabilized();

      expect(await visualize.hasNavigateToLensButton()).to.eql(true);
    });

    it('should show the "Edit Visualization in Lens" menu item', async () => {
      await visEditor.clickBucket('X-axis');
      await visEditor.selectAggregation('Terms');
      await visEditor.selectField('machine.os.raw');
      await visEditor.clickGo();

      expect(await visualize.hasNavigateToLensButton()).to.eql(true);
    });

    it('should convert to Lens', async () => {
      await visEditor.clickBucket('X-axis');
      await visEditor.selectAggregation('Terms');
      await visEditor.selectField('machine.os.raw');
      await visEditor.clickGo();

      await visualize.navigateToLensFromAnotherVisualization();
      await lens.waitForVisualization('heatmapChart');
      const debugState = await lens.getCurrentChartDebugState('heatmapChart');

      // assert axes
      expect(debugState?.axes!.x[0].labels).to.eql(['win 8', 'win xp', 'win 7', 'ios', 'osx']);
      expect(debugState?.axes!.y[0].labels).to.eql(['']);
      expect(debugState?.heatmap!.cells.length).to.eql(5);
      expect(debugState?.legend!.items).to.eql([
        {
          color: '#006837',
          key: '1,322 - 1,717.5',
          name: '1,322 - 1,717.5',
        },
        { color: '#86cb66', key: '1,717.5 - 2,113', name: '1,717.5 - 2,113' },
        {
          color: '#fefebd',
          key: '2,113 - 2,508.5',
          name: '2,113 - 2,508.5',
        },
        {
          color: '#f88d52',
          key: '2,508.5 - 2,904',
          name: '2,508.5 - 2,904',
        },
      ]);
    });

    it('should convert to Lens if Y-axis is defined, but X-axis is not', async () => {
      await visEditor.clickBucket('Y-axis');
      await visEditor.selectAggregation('Terms');
      await visEditor.selectField('machine.os.raw');
      await visEditor.clickGo();

      await visualize.navigateToLensFromAnotherVisualization();
      await lens.waitForVisualization('heatmapChart');
      const debugState = await lens.getCurrentChartDebugState('heatmapChart');

      expect(debugState?.axes!.x[0].labels).to.eql(['*']);
      expect(debugState?.axes!.y[0].labels).to.eql(['win 8', 'win xp', 'win 7', 'ios', 'osx']);
      expect(debugState?.heatmap!.cells.length).to.eql(5);
    });

    it('should respect heatmap colors number', async () => {
      await visEditor.clickBucket('X-axis');
      await visEditor.selectAggregation('Terms');
      await visEditor.selectField('machine.os.raw');
      await visEditor.clickGo();

      await visEditor.clickOptionsTab();
      await visEditor.changeHeatmapColorNumbers(6);
      await visEditor.clickGo();
      await visChart.waitForVisualizationRenderingStabilized();

      await visualize.navigateToLensFromAnotherVisualization();
      await lens.waitForVisualization('heatmapChart');
      const debugState = await lens.getCurrentChartDebugState('heatmapChart');

      expect(debugState?.legend!.items).to.eql([
        { key: '1,322 - 1,585.667', name: '1,322 - 1,585.667', color: '#006837' },
        { key: '1,585.667 - 1,849.333', name: '1,585.667 - 1,849.333', color: '#4cb15d' },
        { key: '1,849.333 - 2,113', name: '1,849.333 - 2,113', color: '#b7e075' },
        { key: '2,113 - 2,376.667', name: '2,113 - 2,376.667', color: '#fefebd' },
        { key: '2,376.667 - 2,640.333', name: '2,376.667 - 2,640.333', color: '#fdbf6f' },
        { key: '2,640.333 - 2,904', name: '2,640.333 - 2,904', color: '#ea5839' },
      ]);
    });

    it('should show respect heatmap custom color ranges', async () => {
      await visEditor.clickBucket('X-axis');
      await visEditor.selectAggregation('Terms');
      await visEditor.selectField('machine.os.raw');
      await visEditor.clickGo();

      await visEditor.clickOptionsTab();
      await visEditor.clickOptionsTab();
      await visEditor.clickEnableCustomRanges();
      await visEditor.clickAddRange();
      await visEditor.clickAddRange();
      await visEditor.clickAddRange();
      await visEditor.clickAddRange();
      await visEditor.clickAddRange();

      await visEditor.clickGo();
      await visChart.waitForVisualizationRenderingStabilized();

      await visualize.navigateToLensFromAnotherVisualization();
      await lens.waitForVisualization('heatmapChart');
      const debugState = await lens.getCurrentChartDebugState('heatmapChart');

      expect(debugState?.legend!.items).to.eql([
        {
          color: '#006837',
          key: '0 - 100',
          name: '0 - 100',
        },
        {
          color: '#65bc62',
          key: '100 - 200',
          name: '100 - 200',
        },
        {
          color: '#d8ef8c',
          key: '200 - 300',
          name: '200 - 300',
        },
        {
          color: '#fedf8b',
          key: '300 - 400',
          name: '300 - 400',
        },
        {
          color: '#f36d43',
          key: '400 - 500',
          name: '400 - 500',
        },
        {
          color: '#a50026',
          key: '500 - 600',
          name: '500 - 600',
        },
      ]);
    });
  });
}
