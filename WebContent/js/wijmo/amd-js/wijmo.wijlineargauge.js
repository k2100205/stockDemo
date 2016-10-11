var wijmo;define(["./wijmo.wijgauge"],function(){var e=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);r.prototype=t.prototype,e.prototype=new r};(function(t){(function(t){var n=function(n){function r(){n.apply(this,arguments)}return e(r,n),r.prototype._setDefaultWidth=function(){var e=this.options;e.width=e.orientation==="horizontal"?310:70},r.prototype._setDefaultHeight=function(){var e=this.options;e.height=e.orientation==="horizontal"?70:310},r.prototype._set_orientation=function(){var e=this;e._setDefaultWidth(),e._setDefaultHeight(),e.redraw()},r.prototype._set_xAxisLocation=function(){this.redraw()},r.prototype._set_xAxisLength=function(){this.redraw()},r.prototype._set_yAxisLocation=function(){this.redraw()},r.prototype._clearState=function(){n.prototype._clearState.call(this),this.markBbox&&(this.markBbox=null)},r.prototype._create=function(){n.prototype._create.call(this),this.element.addClass(this.options.wijCSS.linearGauge)},r.prototype._paintLabel=function(e,n){var r=this,i=r.options,s=n.format,o=n.style,u=n.offset,a=e,f=r.options.tickMajor,l=f.position||"inside",c,h,p,d;return s!==""&&(a=t.GaugeUtil.formatString(e,s)),p=r._getMarkerBbox(),d=r._getLabelBBox(a),c=r._valueToPoint(e,0),i.orientation==="horizontal"?(l==="inside"?c.y=p.y-d.height:c.y=p.y+p.height+d.height/2,c.y+=u):(l==="inside"?c.x=p.x-d.width/2:c.x=p.x+p.width+d.width/2,c.x+=u),h=r.canvas.text(c.x,c.y,a),h.attr(o),$.wijraphael.addClass($(h.node),i.wijCSS.linearGaugeLabel),h},r.prototype._getLabelBBox=function(e){var t=this,n=t.options,r,i;return r=t.canvas.text(0,0,e),r.attr(n.gaugeLableStyle),i=r.wijGetBBox(),r.wijRemove(),i},r.prototype._getMarkerBbox=function(){var e=this,t=e.options,n=t.tickMajor,r;return e.markBbox||(r=e._paintMark(0,n),e.markBbox=r.wijGetBBox(),r.wijRemove()),e.markBbox},r.prototype._paintMark=function(e,n,r){var i=this,s=i.options,o=n.marker||"rect",u=o==="rect"?5:2,a=i._valueToPoint(e,0),f=n.position||"inside",l=n.offset||0,c=r?2:1,h,p,d=$.extend({},n.style);return h=u*n.factor,$.isFunction(o)?o.call(i,i.canvas,a,s):(o==="cross"&&(d.stroke=d.fill),s.orientation==="horizontal"?p=t.GaugeUtil.paintMarker(i.canvas,o,a.x,a.y,c,h,!0):p=t.GaugeUtil.paintMarker(i.canvas,o,a.x,a.y,h,c),p.attr(d),$.wijraphael.addClass($(p.node),s.wijCSS.linearGaugeMarker),i._applyPosition(p,f,l,e),p)},r.prototype._applyPosition=function(e,t,n,r){var i=0,s=0,o=this,u=o.options.orientation==="horizontal",a=e.wijGetBBox();switch(t){case"inside":u?s-=a.width/2+n:i-=a.width/2+n;break;case"outside":u?s+=a.width/2+n:i+=a.width/2+n;break;case"center":u?s-=n:i-=n;break;default:}e.attr("transform","t"+i+","+s)},r.prototype._paintFace=function(){var e=this,t,n=e.options,r=e._innerBbox.width,i=e._innerBbox.height,s=e._innerBbox.left,o=e._innerBbox.top,u={width:r,height:i,x:s,y:o,canvas:e.canvas};return n.face&&n.face.template&&$.isFunction(n.face.template)?n.face.template.call(e,u):(t=e.canvas.rect(s,o,r,i,5),n.face&&n.face.style&&t.attr(n.face.style),$.wijraphael.addClass($(t.node),n.wijCSS.linearGaugeFace),t)},r.prototype._paintPointer=function(){var e=this,t=e.options,n=e._valueToPoint(t.min,0),r=e._innerBbox.width,i=e._innerBbox.height,s=e._innerBbox.left,o=e._innerBbox.top,u=t.pointer,a,f,l,c;if(!u.visible)return;c=t.orientation==="horizontal"?i:r,l=c*u.offset,f=c*u.length,u.template&&$.isFunction(u.template)?a=u.template.call(e.canvas,n,$.extend({},t.pointer,{offset:l,length:f,gaugeBBox:e._innerBbox})):(t.orientation==="horizontal"?u.shape==="rect"?a=e.canvas.rect(n.x-u.width/2,i-f-l+o,u.width,f):a=e.canvas.isoTri(n.x,i-f-l+o,u.width,f,3):u.shape==="rect"?a=e.canvas.rect(r-f-l+s,n.y-u.width/2,f,u.width):a=e.canvas.isoTri(r-f-l+s,n.y-u.width/2,f,u.width),a.attr(u.style)),$.wijraphael.addClass($(a.node),t.wijCSS.linearGaugePointer),e.pointer=a},r.prototype._setPointer=function(){var e=this,t=e.options;if(!e.pointer)return;n.prototype._setPointer.call(this),e._setLinearPointer(t.value)},r.prototype._setLinearPointer=function(e){var t=this,n=t.options,r=t._valueToPoint(n.min,0),i=t._valueToPoint(e,0),s=n.animation,o={x:0,y:0},u;n.orientation==="horizontal"?o.x=i.x-r.x:o.y=i.y-r.y,u="t"+o.x+","+o.y,s.enabled?t.pointer.stop().wijAnimate({transform:u},s.duration,s.easing):t.pointer.attr("transform",u)},r.prototype._minScreenPoint=function(e){var t=this,n=t.options,r=t._innerBbox.width,i=t._innerBbox.height,s=t._innerBbox.left,o=t._innerBbox.top,u=n.yAxisLocation+e;return n.orientation==="horizontal"?{x:r*n.xAxisLocation+s,y:i*u+o}:{x:r*u+s,y:i*(1-n.xAxisLocation)+o}},r.prototype._maxScreenPoint=function(e){var t=this,n=t.options,r=t._innerBbox.width,i=t._innerBbox.height,s=t._innerBbox.left,o=t._innerBbox.top,u=n.yAxisLocation+e,a=n.xAxisLocation+n.xAxisLength;return n.orientation==="horizontal"?{x:r*a+s,y:i*u+o}:{x:r*u+s,y:i*(1-a)+o}},r.prototype._paintRange=function(e){var t=this,n=t.options,r=isNaN(e.startValue)?0:e.startValue,i=isNaN(e.endValue)?0:e.endValue,s=isNaN(e.startWidth)?isNaN(e.width)?0:e.width:e.startWidth,o=isNaN(e.endWidth)?isNaN(e.width)?0:e.width:e.endWidth,u=e.startDistance||0,a=e.endDistance||0,f,l;r!==i&&(i>r?(f=Math.max(r,n.min),l=Math.min(n.max,i)):(f=Math.max(n.min,i),l=Math.min(n.max,r)),t._drawRange(f,l,u,a,s,o,e))},r.prototype._drawRange=function(e,t,n,r,i,s,o){var u=this,a=u.options,f=a.orientation,l=u._innerBbox.width,c=u._innerBbox.height,h=u._innerBbox.left,p=u._innerBbox.top,d=u._valueToPoint(e,0),v=u._valueToPoint(t,0),m,g,y,b,w,E;f==="horizontal"?(w=i*c,E=s*c,n!==0&&(d.y=n*c+p),r!==0&&(v.y=r*c+p),m={x:d.x,y:d.y-w},g={x:v.x,y:v.y-E}):(w=i*l,E=s*l,n!==0&&(d.x=n*l+h),r!==0&&(v.x=r*l+h),m={x:d.x-w,y:d.y},g={x:v.x-E,y:v.y}),y=["M",d.x,d.y,"L",v.x,v.y,"L",g.x,g.y,"L",m.x,m.y,"Z"],b=u.canvas.path(y.join(" ")),b.attr(o.style),$.wijraphael.addClass($(b.node),a.wijCSS.linearGaugeRange),u.ranges.push(b)},r.prototype._valueToPoint=function(e,t){var n=this,r=n.options,i=r.isInverted,s,o,u;return r.max===r.min?{x:0,y:0}:(s=n._valueToLogical(e),o=n._minScreenPoint(t),u=n._maxScreenPoint(t),i?{x:o.x*s+u.x*(1-s),y:o.y*s+u.y*(1-s)}:{x:o.x*(1-s)+u.x*s,y:o.y*(1-s)+u.y*s})},r.prototype.destroy=function(){n.prototype.destroy.call(this),this.element.removeClass(this.options.wijCSS.linearGauge)},r}(t.wijgauge);t.wijlineargauge=n,n.prototype.widgetEventPrefix="wijlineargauge";var r=function(){function e(){this.initSelector=":jqmData(role='wijlineargauge')",this.wijCSS={linearGauge:"wijmo-wijlineargauge",linearGaugeLabel:"wijmo-wijlineargauge-label",linearGaugeMarker:"wijmo-wijlineargauge-mark",linearGaugeFace:"wijmo-wijlineargauge-face",linearGaugePointer:"wijmo-wijlineargauge-pointer",linearGaugeRange:"wijmo-wijlineargauge-range"},this.orientation="horizontal",this.xAxisLocation=.1,this.xAxisLength=.8,this.yAxisLocation=.5,this.width="auto",this.height="auto",this.pointer={length:.5,width:4,offset:0,visible:!0,template:null,shape:"tri",style:{fill:"#1E395B",stroke:"#1E395B"}},this.marginLeft=5,this.marginTop=5,this.marginRight=5,this.marginBottom=5}return e}();n.prototype.options=$.extend(!0,{},t.wijgauge.prototype.options,new r),$.wijmo.registerWidget("wijlineargauge",n.prototype)})(t.gauge||(t.gauge={}));var n=t.gauge})(wijmo||(wijmo={}))});