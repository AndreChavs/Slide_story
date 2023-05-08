export default class Timeout{
  public id;
  public handler;
  public start;
  public timeLeft;
  constructor(handler: TimerHandler, time: number){
    this.id = setTimeout(handler, time)
    this.handler = handler;
    this.start = Date.now()
    this.timeLeft = time
  }
  public clear(){
    clearTimeout(this.id)
  }
  public pause(){
    const passed = Date.now() - this.start;
    this.timeLeft = this.timeLeft - passed;
    this.clear()
  }
  public continue(){
    this.clear()
    this.id = setTimeout(this.handler, this.timeLeft)
    this.start = Date.now()
  }
}