import * as consts from '../../consts';

export interface InfoActions{
    infoPerMessage: (stateChange: number) => {
        type: consts.InfoActionsTypes.PER_MESSAGE,
        robotState: number
    }

    ansibleDisconnect: () => {
        type: consts.InfoActionsTypes.ANSIBLE_DISCONNECT
    }

    runtimeConnect: () => {
        type: consts.InfoActionsTypes.RUNTIME_CONNECT
    }

    masterStatus: () => {
        type: consts.InfoActionsTypes.MASTER_ROBOT
    }

    runtimeDisconnect: () => {
        type: consts.InfoActionsTypes.RUNTIME_DISCONNECT
    }

    updateCodeStatus: (studentCodeStatus: string) => {
        type: consts.InfoActionsTypes.CODE_STATUS
        studentCodeStatus: string
    }

    ipChange: (ipAddress: string) => {
        type: consts.InfoActionsTypes.IP_CHANGE,
        ipAddress: string
    }
}