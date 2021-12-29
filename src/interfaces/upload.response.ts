export interface UploadResponse {
  hash: string;
  typeFile: string;
  url: string;
  rootPath: string;
  originalName: string;
}

export interface UploadFileDto {
  typeFile: string;
  base64: string;
  name: string;
}
