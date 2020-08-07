export const infoPerMessage = () => ({
  type: 'PER_MESSAGE',
});

export const ansibleDisconnect = () => ({
  type: 'ANSIBLE_DISCONNECT',
});

export const runtimeConnect = () => ({
  type: 'RUNTIME_CONNECT',
});

export const masterStatus = () => ({
  type: 'MASTER_ROBOT',
});

export const runtimeDisconnect = () => ({
  type: 'RUNTIME_DISCONNECT',
});

export const updateCodeStatus = studentCodeStatus => ({
  type: 'CODE_STATUS',
  studentCodeStatus,
});

export const ipChange = ipAddress => ({
  type: 'IP_CHANGE',
  ipAddress,
});
