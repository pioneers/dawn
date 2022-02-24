export const createErrorCallback = (logPrefix: string) => (error: NodeJS.ErrnoException | null) => {
  if (error !== null) {
    console.error(`Error - ${logPrefix}: ${error}`);
  }
};
