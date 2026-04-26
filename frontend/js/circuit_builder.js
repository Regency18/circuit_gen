import { Input, Wire, Output } from '../../logic-circuits-js/src/main'
import { shapes, dia, util } from '@joint/core'
import { OrSVG, NotSVG, AndSVG } from './svg'

//make circuit builder class that takes dict and builds a circuit
export class CircuitBuilder {
    constructor() {
        this.gates = { output: new Output({ position: { x: 950, y: 300 } }) };
        this.wires = [];
        this.andCount = 0;
        this.orCount = 0;
        this.notCount = 0;
        this.customCount = 0;
        this.inputCount = 0;
        this.depthCounters = {};
    }

    //calculate position for a new gate based on type and count
    getGatePosition(type, depth = 0, childIndex = 0, totalChildren = 1) {
        if (type === 'input') {
            // Inputs on the far left
            const startY = 200;
            const verticalSpacing = 80;
            return { x: 100, y: startY + (this.inputCount * verticalSpacing) };
        } else if (type === 'operation') {
            // Operations positioned right-to-left based on depth
            // Children spread vertically centered around parent
            const horizontalSpacing = 200;
            const verticalSpacing = 120; // Space between children
            const startX = 750; // Start from right side

            // X position based on depth (further left for deeper/earlier gates)
            const x = startX - (depth * horizontalSpacing);

            // Y position: spread children evenly
            // Center the group of children vertically
            const totalHeight = (totalChildren - 1) * verticalSpacing;
            const centerOffset = totalHeight / 2;
            const y = 300 - centerOffset + (childIndex * verticalSpacing);

            return { x, y };
        }
        return { x: 200, y: 300 };
    }

    //visit node with depth and child positioning
    visit(dict, parentGate, i, depth = 0, childIndex = 0, totalChildren = 1) {
        if (dict["type"] === "Variable") {
            this.visitVariable(dict, parentGate, i);
        } else if (dict["type"] === "Operation") {
            this.visitOperation(dict, parentGate, i, depth, childIndex, totalChildren);
        }
    }

    //visit Variable node stays the same
    visitVariable(dict, parentGate, i) {
        let gate = 0;
        //add new gate if DNE, else find existing gate
        if (dict["name"] in this.gates) {
            gate = this.gates[dict["name"]];
        } else {
            gate = new Input({
                position: this.getGatePosition('input'),
                attrs: {
                    text: { text: dict["name"] }
                }
            });
            this.inputCount++;
            this.gates[dict["name"]] = gate;
        }

        //add new wire from gate to parent gate
        this.wires.push(
            { source: { id: gate.id, port: 'out' }, target: { id: parentGate.id, port: `in${i + 1}` } }
        )
    }

    /*visit operation node Or, And, Not, 
    must be connected to parent gate, and child gates*/
    visitOperation(dict, parentGate, i, depth = 0, childIndex = 0, totalChildren = 1) {
        //add new gate
        let gate = 0;
        const length = dict["children"].length;

        //make gate of correct size, and add to graph
        const pos = this.getGatePosition('operation', depth, childIndex, totalChildren);

        if (dict["name"] === "Or") {
            gate = this.makenewGate(length, dict["name"]);
            gate.position(pos.x, pos.y);  // This is correct

            this.gates[dict['name'] + `${this.orCount}`] = gate;
            this.orCount++;
        } else if (dict["name"] === "And") {
            gate = this.makenewGate(length, dict["name"]);
            gate.position(pos.x, pos.y);  // This is correct

            this.gates[dict['name'] + `${this.andCount}`] = gate;
            this.andCount++;
        } else if (dict["name"] === "Not") {
            gate = this.makenewGate(length, dict["name"]);
            gate.position(pos.x, pos.y);  // This is correct

            this.gates[dict['name'] + `${this.notCount}`] = gate;
            this.notCount++;
        }
        //add new wire from gate to parent gate
        if (parentGate === this.gates["output"]) {
            this.wires.push(
                { source: { id: gate.id, port: 'out' }, target: { id: parentGate.id, port: 'in' } }
            )
        } else {
            this.wires.push(
                { source: { id: gate.id, port: 'out' }, target: { id: parentGate.id, port: `in${i + 1}` } }
            )
        }

        //create children - spread them vertically at next depth
        const numChildren = dict["children"].length;
        for (let input = 0; input < numChildren; input++) {
            this.visit(dict["children"][input], gate, input, depth + 1, input, numChildren);
        }
    }

    //create new gate of given size, and add to graph
    makenewGate(size, Operation) {
        //build attrs with inputs and outputs
        let gate = 0;
        var portsIn = {
            position: {
                name: 'left'
            },
            attrs: {
                circle: {
                    r: 4,  // Make visible for debugging
                    magnet: true,
                    fill: 'red',
                    stroke: 'black'
                }
            }
        };

        var portsOut = {
            position: {
                name: 'right'
            },
            attrs: {
                circle: {
                    r: 4,  // Make visible for debugging
                    magnet: 'passive',
                    fill: 'blue',
                    stroke: 'black'
                }
            }
        };

        //create new gate, and create custom gate with correct number of inputs
        if (Operation === "Or") {
            const Orgate = OrSVG.define("logic.customOr", {
                size: { width: 45, height: 40 },
                ports: {
                    groups: {
                        'in': portsIn,
                        'out': portsOut
                    }
                }
            });

            gate = new Orgate();

            const arr = [];
            for (let i = 0; i < size; i++) {
                arr.push({ id: `in${i + 1}`, group: 'in' });
            }

            arr.push({ id: 'out', group: 'out' });

            gate.addPorts(arr);
        } else if (Operation === "And") {
            const Andgate = AndSVG.define("logic.customAnd", {
                size: { width: 45, height: 40 },
                ports: {
                    groups: {
                        'in': portsIn,
                        'out': portsOut
                    }
                }
            });

            gate = new Andgate();

            const arr = [];
            for (let i = 0; i < size; i++) {
                arr.push({ id: `in${i + 1}`, group: 'in' });
            }

            arr.push({ id: 'out', group: 'out' });

            gate.addPorts(arr);
        } else {
            const Notgate = NotSVG.define("logic.customNot", {
                size: { width: 44, height: 40 },
                ports: {
                    groups: {
                        'in': portsIn,
                        'out': portsOut
                    }
                }
            });

            gate = new Notgate();

            const arr = [];
            arr.push({ id: 'in', group: 'in' });
            arr.push({ id: 'out', group: 'out' });

            gate.addPorts(arr);
        }

        return gate;
    }
}