import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  nuont = 1;
  name = 'angularComponent'
  date:any
  testCilck() {
    this.nuont = ++this.nuont 
  }
  
  testoutput(msg:string){
    console.log('event',msg)
  }


  ngOnInit(): void {
    setInterval(()=>{
      this.date = new Date().toLocaleTimeString()
    },1000)
  }
}
