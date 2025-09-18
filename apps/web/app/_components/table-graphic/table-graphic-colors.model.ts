export interface TableGraphicColors {
  baseColor: string;
  contrasts: {
    dark: string;
    light: string;
  };
}

export const TABLE_GRAPHIC_COLORS_DEFAULTS: TableGraphicColors = {
  baseColor: '#dfdfdf',
  contrasts: {
    dark: '#979797',
    light: '#cbcbcb',
  },
};
