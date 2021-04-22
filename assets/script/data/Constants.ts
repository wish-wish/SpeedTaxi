import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum EventName{
    GREETING = 'greeting',
    GOODBYE = 'goodbyte',
    FINISHEDWALK = 'finishedwalk',
    STARTBREAKING = 'startbreaking',
    ENDBREAKING = 'endbreaking',
    SHOWCOIN = 'showcoin',
    GAMESTART = 'gamestart',
    GAMEOVER = 'gameover',
    NEWLEVEL = 'newlevel',
    SHOWTALK = 'showtalk',
    SHOWGUIDE = 'showguide',
    UPDATEPROGRESS = 'updateprogress',
}

enum AudioFiles{
    BG="background",
    ClICK='click',
    CRASH='crash',
    GETMONEY='getMoney',
    INCAR='inCar',
    NEWORDER ='newOrder',
    START='start',
    STOP='stop',
    TOOTING1='tooting1',
    TOOTING2='tooting2',
    WIN='win',
}

enum CarGroup{
    NORMAL = 1<<0,
    MAINCAR = 1<<1,
    OTHERCAR = 1<<2,
}

enum CustomerState{
    NONE,
    GREETING,
    GOODBYE,
}

@ccclass('Constants')
export class Constants extends Component {
    public static EventName = EventName;
    public static CustomerState=CustomerState;
    public static AudioFiles=AudioFiles;
    public static CarGroup=CarGroup;
    public static talkTable = [
        "Please hurry up.\n I have a plane to catch",
        "The most beautiful day \n is not the rainy day",
    ]

    public static UIPage={
        mainUI:'mainUI',
        gameUI:'gameUI',
        resultUI:'resultUI',
    }

    public static GameConfigID = 'SpeedTaxi_CACHE';
    public static PlayerConfigID = 'playerInfo';
    public static MaxLevel = 2;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
