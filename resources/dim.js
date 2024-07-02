
/**
 * @file Q.js
 * @author Dimitris Vainanidis
 * @copyright Dimitris Vainanidis, 2023
 */

/* jshint ignore:start */
'use strict';

{








/** 
 * Returns the selected DOM element or array of elements, by ID, class, e.t.c. 
 * Adds the extra methods to the element/array: on, set, show(condition). 
 * @type {(selector: string) => HTMLElement | HTMLElement[]}
*/
let Q = (selector) => {
    if ( selector.charAt(0)=='#' ) {  
          let element = document.querySelector(selector);    
          element.on ??= function(event,callback){element.addEventListener(event,callback);return element};
          element.set ??= function(content){element.textContent=content};
          element.show ??= function(condition=true){if (condition) {element.classList.remove('d-none')} else {element.classList.add('d-none')} };
          return element;
    } else {
          if (selector.charAt(0)=='~') {selector=`[data-variable=${selector.substring(1)}]`}
          let elements = [...document.querySelectorAll(selector)];
          elements.set ??= function(content){elements.forEach(el=>el.textContent=content)};
          elements.show ??= function(condition=true){elements.forEach(el=>{
              if (condition) {el.classList.remove('d-none')} else {el.classList.add('d-none')}
          })};
          elements.on ??= function(event,action,options){
              if (options=="live"){
                  document.addEventListener(event,(e)=>{if(e.target.matches(selector)){action(e)}});
              } else {
                  elements.forEach(el=>el.addEventListener(event,action,options));
              }
          }
          return elements;
    }
};




/** 
 * Change the value of a css variable 
 * @type {(variable: string, value: string) => string}  
 */
Q.setCssVariable = (variable,value) => {document.documentElement.style.setProperty(variable, value); return value};

/** returns the array's unique values */
Q.unique = array => [...new Set(array)];
/** sum of an array of numbers  */
Q.sum = array => array.reduce((prev,curr)=>prev+(+curr),0);   // +val converts to number


/** 
 * Fetch that returns the result as JSON or the desired property 
 * @param {string} URL The URL to fetch
 * @param {string | boolean} [property=true] The property to return, or true for the entire object (JSON), or false for text 
 * @type {(URL: string, property: string | boolean) => Promise<any>}
*/
Q.fetch = async (URL,property=true) => {
    return fetchResult = await fetch(URL)               //return, so user can use "then"
            .then(response=>{
                if (!response.ok) {throw new Error('Q.fetch failed')} 
                else {return property?response.json():response.text()}
            })
            .then(data=>(property&&property!==true)?data[property]:data)      //property truthy but not true!
            .catch(e=>{console.error(e)});     
};



/** Get things from the URL */
Q.url = {
    get: (parameter) => new URLSearchParams(window.location.search).get(parameter),
    domain: window.location.hostname,
    path: window.location.pathname,
};




/** 
 * Cookie hanlders  
*/
Q.cookies = {
    set: function(name,value,days) {
        let expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        let secure = (window.location.protocol=="https:") ? " secure;" : "";
        document.cookie = `${name}=${value||""}${expires}; path=/; samesite=lax;${secure}`;
    },
    get: function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
};


/** Converts a number to euro format */
Q.euro = price => (price==null||isNaN(price)) ? "- €" : (new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
})).format(price);















this.Q = Q;
}