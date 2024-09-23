"use strict";(()=>{var e={};e.id=290,e.ids=[290],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},2299:(e,t,n)=>{n.r(t),n.d(t,{config:()=>u,default:()=>l,routeModule:()=>p});var i={};n.r(i),n.d(i,{default:()=>o});var a=n(1802),r=n(7153),s=n(6249);async function o(e,t){let n=`
      {
        businesses {
          id
          name
        }
      }
    `,i=await fetch("https://lightslategray-mink-295930.hostingersite.com/api/graphql",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:n})}),a=["/","/about","/contact","/services",...(await i.json()).data.businesses.map(e=>`/business/${e.id}`)],r=`<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${a.map(e=>`
              <url>
                <loc>http://localhost:3000${e}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
              </url>
            `).join("")}
      </urlset>`;t.setHeader("Content-Type","text/xml"),t.write(r),t.end()}let l=(0,s.l)(i,"default"),u=(0,s.l)(i,"config"),p=new a.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/sitemap",pathname:"/api/sitemap",bundlePath:"",filename:""},userland:i})},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var n=t(t.s=2299);module.exports=n})();