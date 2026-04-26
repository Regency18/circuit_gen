import { dia, shapes, util } from '@joint/core'
import { Input, Wire, Output } from '../../logic-circuits-js/src/main'
import { CircuitBuilder } from './circuit_builder'
import { OrSVG, NotSVG, AndSVG } from './svg'


const equation = document.getElementById("equation");
console.log(equation)
const btn = document.getElementById("result");
const circuit = document.getElementById("circuit");
const simplified = document.getElementById("simplified")

//send equation string to fastAPI backend
async function sendEquation(event) {
    const response = await fetch('http://localhost:8000/equation', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: equation.value })
    })
    if (!response.ok) {
        circuit.innerText = "The equation you entered is invalid."
        return;
    }
    const data = await response.json();
    console.log("Success", data);

    const cellNamespace = {
        ...shapes,
        logic: {
            Input,
            OrSVG,
            AndSVG,
            NotSVG,
            Wire
        }
    }

    //graph and paper
    const graph = new dia.Graph({}, { cellNamespace });

    const paper = new dia.Paper({

        el: circuit,
        model: graph,
        width: 1000,
        height: 600,
        gridSize: 5,
        snapLinks: true,
        linkPinning: false,
        cellViewNamespace: cellNamespace,
        defaultLink: new Wire,
    })

    // zoom the viewport by 50%
    paper.transformToFitContent();

    //build circuit from response
    const circuitBuilder = new CircuitBuilder();
    circuitBuilder.visit(data["value"], circuitBuilder.gates["output"], 0);

    delete circuitBuilder.gates["output"]; // Remove the output gate from the gates list since it's already added to the graph
    circuitBuilder.wires.shift();

    //add gates and wires to
    graph.addCells(util.toArray(circuitBuilder.gates));
    util.forIn(circuitBuilder.wires,
        function (attributes) {
            graph.addCell(paper.getDefaultLink().set(attributes));
        }
    );

    event.preventDefault();
}

btn.addEventListener("click", sendEquation)

