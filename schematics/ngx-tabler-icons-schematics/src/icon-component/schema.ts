export interface Schema {

  /**
   * Name of the icon
   */
  name: string;

  /** 
   * SVG of the icon to use as a template
   */
  svgTemplate: string;

  style: styleType;

  path?: string;

  project?: string;
}

export type styleType = 'outline' | 'filled';