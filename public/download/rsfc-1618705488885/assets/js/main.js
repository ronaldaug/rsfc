// ==========================
// Global JS
// ==========================
    function scrollIt(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"linear",u=arguments.length>3?arguments[3]:void 0,o={linear:function(e){return e},easeInQuad:function(e){return e*e},easeOutQuad:function(e){return e*(2-e)},easeInOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return--e*e*e+1},easeInOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return 1- --e*e*e*e},easeInOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return 1+--e*e*e*e*e},easeInOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e}},i=window.pageYOffset,r="now"in window.performance?performance.now():(new Date).getTime(),c=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight),a=window.innerHeight||document.documentElement.clientHeight||document.getElementsByTagName("body")[0].clientHeight,f="number"==typeof e?e:e.offsetTop,d=Math.round(c-f<a?c-a:f);if("requestAnimationFrame"in window==!1)return window.scroll(0,d),void(u&&u());!function e(){var c="now"in window.performance?performance.now():(new Date).getTime(),a=Math.min(1,(c-r)/n),f=o[t](a);window.scroll(0,Math.ceil(f*(d-i)+i)),window.pageYOffset!==d?requestAnimationFrame(e):u&&u()}()};
    var allAnchors = document.querySelectorAll('a[href^="#"]');
    if(allAnchors){
    allAnchors.forEach(link=>{
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let goTo = document.querySelector('section#'+link.hash.substring(1));

        // scrollit ( goto, time, effect, callback )
        scrollIt(goTo, 600, 'easeInOutCubic');
        });
    })
    }
    
/* ==== Start header-two js ==== */
        
  var menu = new MmenuLight(document.querySelector("#menu"), "all");

var navigator = menu.navigation({
  // selectedClass: 'Selected',
  // slidingSubmenus: true,
  // theme: 'dark',
  // title: 'Menu'
});

var drawer = menu.offcanvas({
  // position: 'right'
});

//	Open the menu.
document.querySelector('a[href="#menu"]').addEventListener("click", (evnt) => {
  evnt.preventDefault();
  drawer.open();
});

/* ==== End header-two js  ==== */

/* ==== Start product-list-two js ==== */
        
    tns({
      "container": ".category-slider-two",
      "items": 1,
      "mouseDrag": true,
      "slideBy": "page",
      "gutter": 10,
      "speed": 400,
      "nav": false,
      "rewind": true,
      "autoplay": true,
      "autoplayButtonOutput": false,
      "controlsText": ["<i class='la la-angle-left'></i>", "<i class='la la-angle-right'></i>"],
      "lazyload": true
    })
  
/* ==== End product-list-two js  ==== */
