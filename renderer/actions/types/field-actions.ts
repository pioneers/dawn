import * as consts from '../../consts';

export interface FieldActions{
    updateTimer: (msg: { total_stage_time: number; stage_time_so_far: number; stage_name: string; }) => {
        type: consts.FieldActionsTypes.UPDATE_TIMER,
        timeLeft: number,
        stage: string,
        totalTime: number
    }

    updateHeart: () => {
        type: consts.FieldActionsTypes.UPDATE_HEART
    }

    updateMaster: (msg: any) => {
        type: consts.FieldActionsTypes.UPDATE_MASTER,
        blueMaster: number,
        goldMaster: number
    }

    updateMatch: (msg: any) => {
        type: consts.FieldActionsTypes.UPDATE_MATCH,
        matchNumber: number,
        teamNames: string,
        teamNumbers: number[]
    }

    updateRobot: (msg: any) => {
        type: consts.FieldActionsTypes.UPDATE_ROBOT,
        autonomous: number,
        enabled: boolean
    }

    toggleFieldControl: (msg: any) => {
        type: consts.FieldActionsTypes.FIELD_CONTROL,
        fieldControl: boolean
    }

    updateFieldControl: (msg: any) => {
        type: consts.FieldActionsTypes.UPDATE_FC_CONFIG,
        stationNumber: number,
        bridgeAddress: string
    }

}