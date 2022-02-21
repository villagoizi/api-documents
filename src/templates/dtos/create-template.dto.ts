export interface CreateTemplateDto {
  name: string;
  globalVariables: Array<string>;
  file: Express.Multer.File;
}
