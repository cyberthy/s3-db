export type IFile = {
  src: string;
  path: string;
  metadata: IFileMetadata;
};

export type IFileMetadata = {
  name: string;
  size: number;
  data: Buffer;
  mimetype: string;
};

export type IFileFieldOptions = {};
