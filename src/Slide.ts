import Timeout from "./Timeout.js";

export default class Slide {
  public container: Element;
  public slides: Element[];
  public controls: Element;
  public time: number;
  public index: number;
  public slide: Element;
  public timeout: Timeout | null;
  public pausedTimeout: Timeout | null;
  public paused: boolean;
  public thumbItems: HTMLElement[] | null;
  public thumb: HTMLElement | null;
  constructor( container: Element, slides: Element[], controls: Element, time: number = 3000 ){
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;
    this.index = (localStorage.getItem('activeSlide'))? Number(localStorage.getItem('activeSlide')) : 0;
    this.slide = this.slides[this.index]
    this.timeout = null
    this.pausedTimeout = null
    this.paused = false
    this.thumbItems = null
    this.thumb = null  
    this.init()      
  }
  
  private hide(el: Element){ //Remove a class "active" do elementos do array
    el.classList.remove('active');
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0
      el.pause()
    }
  }

  private prev(){ //Se não estiver pausado, retorne para o slide anterior
    if (this.paused) return
    const anterior = (this.index - 1 >= 0)? this.index - 1 : this.slides.length - 1;    
    this.show(anterior)
  }
  private next(){ //Se não estiver pausado, avance para o próximo slide
    if (this.paused) return
    const proximo = (this.index + 1 < this.slides.length)? this.index + 1 : 0;
    this.show(proximo)
  }

  private pause(){
    document.body.classList.add('paused')

    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause()
      this.paused = true
      this.thumb?.classList.add('paused')
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.pause()
      }
    }, 300)
    
  }
  private continue(){  
    document.body.classList.remove('paused')    

    this.pausedTimeout?.clear()
    if (this.paused){
      this.paused = false
      this.timeout?.continue()
      this.thumb?.classList.remove('paused')
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.play()
      }
    }
  }

  private show(index: number = this.index){
    this.index = index;
    this.slide = this.slides[this.index] //array[0]
    localStorage.setItem('activeSlide', String(this.index))
    
    if(this.thumbItems){
      this.thumb = this.thumbItems[this.index]
      this.thumbItems.forEach( el => el.classList.remove('active'))
      this.thumb.classList.add('active')
    }
    
    this.slides.forEach( el => this.hide(el)) //limpa antes de adicionar
    this.slide.classList.add('active') 
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide)
    } else {
      this.auto(this.time)    
    }  
  }

  private autoVideo(video: HTMLVideoElement){
    video.muted = true
    video.play()
    let firstPlay = true;
    video.addEventListener('playing', () => {
      if(firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    })
  }

  private addControls(){
    const prevButton = document.createElement('button')
    const nextButton = document.createElement('button')
    prevButton.innerText = `Slide Anterior`
    nextButton.innerText = `Próximo Slide`
    this.controls.appendChild(prevButton)
    this.controls.appendChild(nextButton)

    if (this.controls instanceof HTMLElement) {      
      this.controls.addEventListener('pointerdown', () => this.pause())
      document.addEventListener('pointerup', () => this.continue())
      document.addEventListener('touchend', () => this.continue())
    }

    nextButton.addEventListener('pointerup', () => this.next())
    prevButton.addEventListener('pointerup', () => this.prev())
  }
  
  private auto(time:number = this.time){
    this.timeout?.clear()
    this.timeout = new Timeout( () => this.next(), time)
    if (this.thumb) {
      this.thumb.style.animationDuration = `${time}ms`
    }
  }

  public init(){ //Inicia o Slide
    this.addControls();
    this.addThumbItems()
    this.show(this.index);            
  }
  
  private addThumbItems(){
    const thumbContainer = document.createElement('div')
    thumbContainer.id = 'slide-thumb'
    for(let i = 0; i < this.slides.length; i++){
      thumbContainer.innerHTML += `
        <span><span class="thumb-item"></span></span>
      `
    }
    this.controls.appendChild(thumbContainer)
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"))
  } 
}