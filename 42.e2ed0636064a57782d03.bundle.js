(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{1895:function(t,e,n){"use strict";n.r(e);var o=n(0),r=n.n(o),a=n(1),i=n.n(a),c=n(1015),u=n.n(c),s=n(1866),d=Object(s.a)({channelTypes:{color:"Color",fontFamily:"Category",fontSize:"Numeric",fontWeight:"Category",text:"Text"},defaultEncoding:{color:{value:"black"},fontFamily:{value:"Helvetica"},fontSize:{value:20},fontWeight:{value:"bold"},text:{value:""}}});function l(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function f(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,"ROTATION",(function(){return h})),n.d(e,"default",(function(){return p}));var h={flat:function(){return 0},random:function(){return 30*Math.floor(6*Math.random()-3)},square:function(){return 90*Math.floor(2*Math.random())}},p=function(t){function e(){for(var e,n=arguments.length,o=Array(n),r=0;r<n;r++)o[r]=arguments[r];return f(l(e=t.call.apply(t,[this].concat(o))||this),"isMounted",!1),f(l(e),"state",{words:[]}),f(l(e),"createEncoder",d.createSelector()),f(l(e),"setWords",(function(t){e.isMounted&&e.setState({words:t})})),e}!function(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}(e,t);var n=e.prototype;return n.componentDidMount=function(){this.isMounted=!0,this.update()},n.componentDidUpdate=function(t){var e=this.props,n=e.data,o=e.encoding,r=e.width,a=e.height,i=e.rotation;(t.data!==n||t.encoding!==o||t.width!==r||t.height!==a||t.rotation!==i)&&this.update()},n.componentWillUnmount=function(){this.isMounted=!1},n.update=function(){var t=this.props,e=t.data,n=t.width,o=t.height,r=t.rotation,a=t.encoding,i=this.createEncoder(a);i.setDomainFromDataset(e),u()().size([n,o]).words(e).padding(5).rotate(h[r]||h.flat).text((function(t){return i.channels.text.getValueFromDatum(t)})).font((function(t){return i.channels.fontFamily.encodeDatum(t,"Helvetica")})).fontWeight((function(t){return i.channels.fontWeight.encodeDatum(t,"normal")})).fontSize((function(t){return i.channels.fontSize.encodeDatum(t,0)})).on("end",this.setWords).start()},n.render=function(){var t=this.props,e=t.width,n=t.height,o=t.encoding,r=this.state.words,a=this.createEncoder(o);return a.channels.color.setDomainFromDataset(r),i.a.createElement("svg",{width:e,height:n},i.a.createElement("g",{transform:"translate("+e/2+","+n/2+")"},r.map((function(t){return i.a.createElement("text",{key:t.text,fontSize:t.size+"px",fontWeight:t.weight,fontFamily:t.font,fill:a.channels.color.encodeDatum(t,""),textAnchor:"middle",transform:"translate("+t.x+", "+t.y+") rotate("+t.rotate+")"},t.text)}))))},e}(i.a.PureComponent);f(p,"propTypes",{encoding:r.a.any,data:r.a.arrayOf(r.a.any).isRequired,height:r.a.number.isRequired,width:r.a.number.isRequired}),f(p,"defaultProps",{encoding:{},rotation:"flat"})}}]);