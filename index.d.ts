type InquirerFile = {
  name: string;
  short: string;
  value: string;
};

export declare function getComponentName(path: string): string
export declare function getComponentFolder(path: string): string
export declare function isSingleFile(path: string): boolean
export declare function getFiles(cwd: string, componentName?: string): string[]
export declare function getComponentFiles(
  root: string,
  workingDir?: string,
): Promise<InquirerFile[]>
export declare function performReplication(
  path: string,
  answers: { name: string; folder: string },
  workingDir?: string,
): Promise<void>
