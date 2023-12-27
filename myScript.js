const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MY_PLAYER' 

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
var option = $('.option-delete')
const optDelete = $('.option-delete')
var songs= []
songs.push({name: "Cắt đôi nỗi sầu",singer: "Tăng Duy Tân",path: "media/catdoinoisau.mp3",image: "image/catdoinoisau.jpg"})
songs.push({name: "Em là ai",singer: "Keyo",path: "media/emlaai.mp3",image: "image/emlaai.jpg"})
songs.push({name: "Gấp đôi yêu thương",singer: "Tuấn Hưng",path: "media/gapdoiyeuthuong.mp3",image: "image/gapdoiyeuthuong.jpg"})
songs.push({name: "Cat doi noi sau",singer: "Thanh Dat",path: "media/catdoinoisau.mp3",image: "image/catdoinoisau.jpg"})
songs.push({name: "Em la ai",singer: "Keyo",path: "media/emlaai.mp3",image: "image/emlaai.jpg"})
songs.push({name: "Gap doi yeu thuong",singer: "Tuan Hung",path: "media/gapdoiyeuthuong.mp3",image: "image/gapdoiyeuthuong.jpg"})

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isOption: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},

    setConfig: function(key,value){
        this.config[key] =value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls = songs.map((song,index)=>{
            return `<div class="song ${index === this.currentIndex?'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option-delete">
                <i class="fas fa-trash"></i>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('')

    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){

        const cdWidth = cd.offsetWidth

        //Xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        
        //Xu ly phong to / thu nho
        document.onscroll = function(){
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop

                cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            }
        }

        //Xu ly khi click play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()

            }else{
                audio.play()
            }
            
        }
        audio.onplay= function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause=function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };
        
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        //Khi next song
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        //Xu ly random
        randomBtn.onclick = function(){
            app.isRepeat=false
            app.setConfig('isRandom',app.isRepeat)
            repeatBtn.classList.toggle('active',app.isRepeat)

            app.isRandom = !app.isRandom
            app.setConfig('isRandom',app.isRandom)
            randomBtn.classList.toggle('active',app.isRandom)
        }
        //Xu ly Repeat
        repeatBtn.onclick = function(){
            app.isRandom=false
            app.setConfig('isRandom',app.isRandom)
            randomBtn.classList.toggle('active',app.isRandom)

            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat',app.isRepeat)
            repeatBtn.classList.toggle('active',app.isRepeat)
        } 
        //Xu ly next song khi audio ended
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //Lang nghe hanh vi khi click vao playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
                //Xu ly khi click vao song
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                //Xu ly khi click vao option
                if(e.target.closest('.option')){
                    app.isOption =!app.isOption
                    console.log(optDelete)
                }
            }

        }
    },
    scrollToActiveSong: function(){
        if(this.currentIndex<2){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            })
        }else{
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            })
        }

    },
    loadCurrentSong:function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig:function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <= 0){
            this.currentIndex = songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex  
        do {
           newIndex = Math.floor(Math.random() * songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        //Cau hinh config tu ung dung
        this.loadConfig()

        //Dinh nghia thuoc tinh cho object
        this.handleEvents()

        //Lang nghe cac su kien DOM
        this.defineProperties()

        //Tai thong tin bai hat
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hien thi trang thai ban dau random va repeat
        randomBtn.classList.toggle('active',app.isRandom)
        repeatBtn.classList.toggle('active',app.isRepeat)
    }
}
app.start()


