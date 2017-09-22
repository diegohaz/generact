type InquirerFile = {
  name: string;
  short: string;
  value: string;
};

/**
 * Get the folder of a component at `path`.
 *
 * @param path Path to a component.
 * @return The folder of the component given at `path`.
 */
export declare function getComponentFolder(path: string): string

/**
 * Search for React components in directory `root`.
 *
 * @param root Directory to use as root.
 * @param workingDir (Optional) Directory the command is executed from (used for relative paths).
 * @return A promise resolving to an array of objects containing information about found components.
 */
export declare function getComponentFiles(
  root: string,
  workingDir?: string,
): Promise<InquirerFile[]>

/**
 * Replicate component given by `originialPath` into component with name `answers.name`
 * in folder `answers.folder`.
 *
 * `originalPath` should point to the component file itself. Test, styles, etc. will also
 * be copied automatically.
 *
 * @param originalPath Path of the component to replicate.
 * @param answers An object containing `name` and `folder` of the new component.
 * @param workingDir (Optional) Current working directory
 */
export declare function replicate(
  originalPath: string,
  answers: { name: string; folder: string },
  workingDir?: string,
): Promise<void>
