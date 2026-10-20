// Inline script placed in <head>. Marks the document as JS-enabled (which
// arms the CSS reveal states) and reveals [data-reveal] elements as they enter
// the viewport — including elements streamed in or added on client navigation.
// Kept tiny and dependency-free so reveals never wait for the JS bundle.
//
// Wipe/frame variants start fully clipped (zero visible area), which
// IntersectionObserver reports as never intersecting, so their parent is
// observed instead.

export const revealScript = `(function(){
var d=document.documentElement;d.classList.add("js");
function all(){var n=document.querySelectorAll("[data-reveal]");for(var i=0;i<n.length;i++)n[i].classList.add("is-in")}
if(!("IntersectionObserver" in window)||!window.WeakMap){addEventListener("DOMContentLoaded",all);return}
var map=new Map(),seen=new WeakSet();
var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(!e.isIntersecting)continue;var l=map.get(e.target)||[];for(var j=0;j<l.length;j++)l[j].classList.add("is-in");map.delete(e.target);io.unobserve(e.target)}},{rootMargin:"0px 0px -8% 0px",threshold:0.1});
function watch(el){if(seen.has(el)||el.classList.contains("is-in"))return;seen.add(el);var t=/wipe|frame/.test(el.getAttribute("data-reveal"))&&el.parentElement||el;var l=map.get(t);if(!l){l=[];map.set(t,l);io.observe(t)}l.push(el)}
function scan(root){if(root.nodeType!==1)return;if(root.hasAttribute("data-reveal"))watch(root);var n=root.querySelectorAll("[data-reveal]");for(var i=0;i<n.length;i++)watch(n[i])}
new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)scan(a[j])}}).observe(d,{childList:true,subtree:true});
scan(d);
})();`;
