import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState
} from 'react';
import {
  ThemeProvider as ChakraThemeProvider,
  CSSReset,
  theme
} from '@chakra-ui/core';
import { VictoryThemeDefinition } from 'victory-core';

import { Global, css } from '@emotion/core';

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus    via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
  a {
    text-decoration: none;
  }
  a:focus {
    outline: none;
  }
`;

export const Colors = {
  brand: '#0c65EB',
  brandLight: '#1C9EF7',
  brandDark: '#074E9C',
  stroke: '#E4E4E4',
  bg: '#fff',
  bgDark: '#18232b',
  bgMed: '#E5E9Ef',
  textLight: '#e7e7e8',
  textGray: '#909090',
  fg: '#040404',
  fgMed: '#5B5B5B',
  fgLight: '#A1A7B0',
  buttonBg: '#D8E0E7',
  buttonBgDk: '#4A4A4A',
  darkBlue: '#62BEE4',
  gray: '#4C4A5B',
  green: '#66E588',
  red: '#EA5868',
  yellow: '#FFC25C',
  labelBg: '#d8d8d8',
  labelText: '#4C4A5B',
  axisStroke: '#575A5C'
};

export const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    lid: {
      ...Colors
    }
  },
  fonts: {
    body: 'Gotham, sans-serif',
    heading: 'Gotham, serif',
    mono: 'Menlo, monospace'
  },
  breakpoints: ['650px', '900px', '1240px', '1920px']
};

export enum ViewportWidth {
  xs = '320px',
  s = '480px',
  m = '640px',
  l = '1000px',
  xl = '1400px'
}

interface IThemeWrapper {
  children: React.ReactNode;
}

const viewportFontSizeMap: Record<ViewportWidth, number> = {
  [ViewportWidth.xs]: 12,
  [ViewportWidth.s]: 12,
  [ViewportWidth.m]: 10,
  [ViewportWidth.l]: 10,
  [ViewportWidth.xl]: 6
};

const getVictoryTheme = (viewport: ViewportWidth): VictoryThemeDefinition => {
  const fontSize = viewportFontSizeMap[viewport];

  const baseLabelStyles = {
    fontSize,
    padding: 0,
    fill: Colors.textLight,
    stroke: 'none'
  };

  const centeredLabelStyles = {
    ...baseLabelStyles,
    textAnchor: 'middle' as 'middle'
  };

  return {
    area: {
      style: {
        data: {
          fill: Colors.labelBg
        },
        labels: centeredLabelStyles
      }
    },
    axis: {
      style: {
        axis: { stroke: Colors.axisStroke, strokeWidth: 1 },
        grid: { stroke: Colors.axisStroke, strokeWidth: 1 },
        ticks: {
          stroke: Colors.axisStroke,
          strokeWidth: 1,
          size: 10
        },
        tickLabels: baseLabelStyles
      }
    },
    bar: {
      style: {
        data: {
          fill: Colors.labelBg,
          padding: 8,
          strokeWidth: 0
        },
        labels: baseLabelStyles
      }
    },
    line: {
      style: {
        data: {
          fill: 'none',
          stroke: Colors.labelBg,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    tooltip: {
      style: { ...centeredLabelStyles, padding: 5, pointerEvents: 'none' },
      flyoutStyle: {
        stroke: 'none',
        fill: 'none',
        pointerEvents: 'none'
      },
      cornerRadius: 0,
      pointerLength: 0
    },
    voronoi: {
      style: {
        data: {
          fill: 'none',
          stroke: 'none',
          strokeWidth: 0
        },
        labels: {
          ...baseLabelStyles,
          padding: 2,
          pointerEvents: 'none',
          textAnchor: 'end'
        },
        flyout: {
          padding: 2,
          stroke: 'none',
          fill: Colors.labelBg,
          pointerEvents: 'none'
        }
      }
    }
  };
};

const victoryThemeCtx = createContext<VictoryThemeDefinition>({});

const ThemeWrapper: React.FC<IThemeWrapper> = ({ children }) => {
  const [viewport, setViewport] = useState<ViewportWidth>(ViewportWidth.xs);
  const [victoryTheme, setVictoryTheme] = useState<VictoryThemeDefinition>({});

  const handleResize = useCallback((): void => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1400) {
      setViewport(ViewportWidth.xl);
    } else if (viewportWidth >= 1000) {
      setViewport(ViewportWidth.l);
    } else if (viewportWidth >= 640) {
      setViewport(ViewportWidth.m);
    } else if (viewportWidth >= 480) {
      setViewport(ViewportWidth.s);
    } else {
      setViewport(ViewportWidth.xs);
    }
  }, [setViewport]);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useLayoutEffect(() => {
    setVictoryTheme(getVictoryTheme(viewport));
  }, [viewport]);

  return (
    <ChakraThemeProvider theme={customTheme}>
      <CSSReset />
      <Global styles={GlobalStyles} />
      <victoryThemeCtx.Provider value={victoryTheme}>
        {children}
      </victoryThemeCtx.Provider>
    </ChakraThemeProvider>
  );
};

export default ThemeWrapper;

export const useVictoryTheme = (): VictoryThemeDefinition =>
  useContext(victoryThemeCtx);
