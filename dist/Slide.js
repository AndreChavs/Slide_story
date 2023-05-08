import Timeout from "./Timeout.js";
export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    timeout;
    pausedTimeout;
    paused;
    thumbItems;
    thumb;
    constructor(container, slides, controls, time = 3000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = (localStorage.getItem('activeSlide')) ? Number(localStorage.getItem('activeSlide')) : 0;
        this.slide = this.slides[this.index];
        this.timeout = null;
        this.pausedTimeout = null;
        this.paused = false;
        this.thumbItems = null;
        this.thumb = null;
        this.init();
    }
    hide(el) {
        el.classList.remove('active');
        if (el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.pause();
        }
    }
    prev() {
        if (this.paused)
            return;
        const anterior = (this.index - 1 >= 0) ? this.index - 1 : this.slides.length - 1;
        this.show(anterior);
    }
    next() {
        if (this.paused)
            return;
        const proximo = (this.index + 1 < this.slides.length) ? this.index + 1 : 0;
        this.show(proximo);
    }
    pause() {
        document.body.classList.add('paused');
        this.pausedTimeout = new Timeout(() => {
            this.timeout?.pause();
            this.paused = true;
            this.thumb?.classList.add('paused');
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.pause();
            }
        }, 300);
    }
    continue() {
        document.body.classList.remove('paused');
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            this.thumb?.classList.remove('paused');
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.play();
            }
        }
    }
    show(index = this.index) {
        this.index = index;
        this.slide = this.slides[this.index];
        localStorage.setItem('activeSlide', String(this.index));
        if (this.thumbItems) {
            this.thumb = this.thumbItems[this.index];
            this.thumbItems.forEach(el => el.classList.remove('active'));
            this.thumb.classList.add('active');
        }
        this.slides.forEach(el => this.hide(el));
        this.slide.classList.add('active');
        if (this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide);
        }
        else {
            this.auto(this.time);
        }
    }
    autoVideo(video) {
        video.muted = true;
        video.play();
        let firstPlay = true;
        video.addEventListener('playing', () => {
            if (firstPlay)
                this.auto(video.duration * 1000);
            firstPlay = false;
        });
    }
    addControls() {
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        prevButton.innerText = `Slide Anterior`;
        nextButton.innerText = `Próximo Slide`;
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        if (this.controls instanceof HTMLElement) {
            this.controls.addEventListener('pointerdown', () => this.pause());
            document.addEventListener('pointerup', () => this.continue());
            document.addEventListener('touchend', () => this.continue());
        }
        nextButton.addEventListener('pointerup', () => this.next());
        prevButton.addEventListener('pointerup', () => this.prev());
    }
    auto(time = this.time) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
        if (this.thumb) {
            this.thumb.style.animationDuration = `${time}ms`;
        }
    }
    init() {
        this.addControls();
        this.addThumbItems();
        this.show(this.index);
    }
    addThumbItems() {
        const thumbContainer = document.createElement('div');
        thumbContainer.id = 'slide-thumb';
        for (let i = 0; i < this.slides.length; i++) {
            thumbContainer.innerHTML += `
        <span><span class="thumb-item"></span></span>
      `;
        }
        this.controls.appendChild(thumbContainer);
        this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
    }
}
//# sourceMappingURL=Slide.js.map