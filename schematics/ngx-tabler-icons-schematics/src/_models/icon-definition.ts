export interface IconDefinition {
  name: string;
  category: string;
  tags: string[];
  styles: {[key: string]: IconStyle}
}

export interface IconStyle {
  version: string;
  unicode: string;
}