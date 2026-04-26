import { dia, util, shapes } from '@joint/core'
import { Not, Wire } from '../../logic-circuits-js/src/main'

export const OrSVG = dia.Element.define('logic.OrGate', {
    size: { width: 45, height: 40 },  // Add size!
    position: { x: 0, y: 0 },
    attrs: { 
    }
},  {
    markup: util.svg/* xml */`
        <path @selector="body" d="M 0 0 l 20 0 C 35 0 45 15 45 20 C 45 25 35 40 20 40 l -20 0 C 5 20 5 20 0 0 " fill="lightblue" stroke="black"/>
        <text @selector="label" fill="black"/>
    `
});

export const AndSVG = dia.Element.define('logic.AndGate', {
    size: { width: 45, height: 40 },  // Add size!
    position: { x: 50, y: 50 },
    attrs: { 
    }
},  {
    markup: util.svg/* xml */`
        <path @selector="body" d="M 0 0 l 20 0 C 35 0 45 15 45 20 C 45 25 35 40 20 40 l -20 0 l 0 -40 " fill="darkgreen" stroke="black"/>
        <text @selector="label" fill="black"/>
    `
});

export const NotSVG = dia.Element.define('logic.Not', {
    size: { width: 44, height: 40 },  // Add size! (40 for triangle + 4 for circle)
    position: { x: 100, y: 100 },
    attrs: { 
    }
},  {
    markup: util.svg/* xml */`
        <path @selector="body" d="M 0 0 l 35 20 l -35 20 l 0 -40" fill="orange" stroke="black" />
        <circle @selector="bubble" cx="40" cy="20" r="4" fill="white" stroke="black"/>
        <text @selector="label" fill="black"/>
    `
});