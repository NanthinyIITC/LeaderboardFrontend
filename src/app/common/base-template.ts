import { NzNotificationService } from "ng-zorro-antd/notification";


export abstract class BaseTemplate{
    constructor( public message: NzNotificationService){

    }
    // showMessage(severity:string,summary:string,message:string) {
    //     debugger
    //     this.messageService.add({ severity: severity, summary: summary, detail: message, key: 'br', life: 30000 });
    // }
  
    createMessage(type: string, title: string, message: string): void {
        this.message.create(type, title, message, { nzPlacement: 'bottomRight' });
      }
   
}