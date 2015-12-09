const Home = require( "xmas/home/Home" )
const About = require( "xmas/about/About" )
const XPView = require( "xmas/xpview/XPView" )
const Ui = require( "xmas/ui/Ui" )
const scrollEmul = require( "xmas/core/scrollEmul" )

const loop = require( "fz/core/loop" )
const stage = require( "fz/core/stage" )
const pixi = require( "fz/core/pixi" )
const Storyline = require( "xmas/ui/Storyline" )
const cookie = require( "xmas/utils/cookie" )
const loader = require( "loader" )

class Xmas {

  constructor() {
    this._current = null
    this.status = "notLoaded"

    this._binds = {}
    this._binds.onChange = this._onChange.bind( this )
    this._binds.onHome = this._onHome.bind( this )
    this._binds.onIntro = this._onIntro.bind( this )
    this._binds.onAbout = this._onAbout.bind( this )
    this._binds.onXP = this._onXP.bind( this )
    this.onStart = this.onStart.bind( this )

    page( "/home", this._binds.onChange, this._binds.onHome )
    page( "/intro", this._binds.onIntro, this._binds.onIntro )
    page( "/about", this._binds.onChange, this._binds.onAbout )
    page( "/xps/:day/:name/", this._binds.onXP )
    page( "/", this.onStart )
    page()
  }

  onStart(){
    console.log('test')
    if(cookie.getCookie("intro") == ""){
      console.log('intro')
      cookie.createCookie("intro", Date.now(), 1)
      // page("/intro")
      this._onIntro()
    }else{
      console.log('home')
      // page("/home")
      this._onHome()
    }
  }

  _onChange( ctx, next ) {
    if( this._current ) {
    this._current.unbindEvents()
    this._current.hide( next )
    } else {
      next()
    }
  }

  _onIntro(){
    if(this.status!="loaded"){
      this.init(this._binds._onIntro)
    return
      }
    var storyline = new Storyline()
    storyline.x = window.innerWidth/2-200
    storyline.y = window.innerHeight/2
    storyline.show( .6 )
    storyline.hide( 2.7 )
    pixi.stage.addChild( storyline )
    TweenLite.set( this, { delay: 3.4,onComplete: () => {page("/home")}})
  }

  _onHome() {
    if(this.status!="loaded"){
      this.init(this._binds.onHome)
    } else {
      if(!this._home)
        this._home = new Home()
      this._current = this._home
        this._displayCurrent()
    }
  }

    _onAbout() {
      if(this.status!="loaded"){
      this.init(this._binds.onAbout)
    } else {
      if(!this._about)
        this._about = new About()
      this._current = this._about
      this._displayCurrent()
    }
    }

  _onXP(e) {
    if(!this._xp){
      if(this.status=="notLoaded"){
        loader.loadConfig(()=>{
          this._xp = new XPView()
          this._current = this._xp
          this._current.bindEvents()
          this._current.show(e.params.day,e.params.name)
        })
        return
      } else {
        this._xp = new XPView()
      }
    }
    this._current = this._xp
    this._current.bindEvents()
    this._current.show(e.params.day,e.params.name)
  }

  _displayCurrent() {
    this._current.bindEvents()
    this._current.show()
  }

  init(cb){
    if(this.status == "loading"){
      return
    }else if(this.status=="loaded"){
      cb()
      return
    }

    this.status = "loading"
    stage.init()
    pixi.init()

    let ui = null
    loader.on( "ready", () => {
      ui = new Ui()
      ui.bindEvents()
      ui.showLoading()
    })
    loader.on( "complete", () => {
      this.status = "loaded"
      ui.hideLoading()
      ui.showBts()
    })
    loader.load()
    loop.start()
      scrollEmul.bindElements()
      scrollEmul.bindEvents()
    document.getElementById( "main" ).appendChild( pixi.dom )
  }

}

module.exports = Xmas
