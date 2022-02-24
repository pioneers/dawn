import { logging } from '../../utils/utils';

export interface TaskConfig {
  taskId?: string;
  /** If defined, will rerun the task implementation on intervals using the provided interval in msec */
  refreshIntervalMsec?: number;
}

export interface Task<ArgsT extends any[], OutputT> {
  run: (...args: ArgsT) => OutputT | void;
  cancel: () => void;
}

export interface CreateTask<ArgsT extends any[], OutputT> {
  config?: TaskConfig;
  implementation: (...args: ArgsT) => Promise<OutputT> | OutputT | void;
}

export const createTask = <ArgsT extends any[], OutputT = undefined>({
  config = {},
  implementation
}: CreateTask<ArgsT, OutputT>): Task<ArgsT, OutputT> => {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  const run = (...args: ArgsT) => {
    const internalRun = async () => {
      return await implementation(...args);
    };

    let output;
    internalRun()
      .then((result) => {
        output = result;
      })
      .catch((e) => {
        logging.log(`[TASK] ${config.taskId ?? ''}`, e);
      })
      .finally(() => {
        const refreshIntervalMsec = config.refreshIntervalMsec;
        if (refreshIntervalMsec !== undefined) {
          cleanupCurrTimeout();
          timeout = setTimeout(() => run(...args), refreshIntervalMsec);
        }
      });

    // TODO: fix output always undefined
    return output;
  };

  const cleanupCurrTimeout = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  const cancel = () => {
    logging.log(`[TASK] ${config.taskId ?? ''} canceled`);
    cleanupCurrTimeout();
  };

  return {
    run,
    cancel
  } as Task<ArgsT, OutputT>;
};
