import React, { Component } from 'react';
import * as math from 'mathjs';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';

import signals from '../signals.json';

class RLS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            L: 10,
            lambda: 0.1,
            gamma: 1000,
            results: undefined,
            chart: 'e'
        };
        this.handleLChange = this.handleLChange.bind(this);
        this.handleLambdaChange = this.handleLambdaChange.bind(this);
        this.handleGammaChange = this.handleGammaChange.bind(this);
        this.handleChart = this.handleChart.bind(this);
    }

    handleLChange(event) {
        this.setState({L: Number(event.target.value)});
    }

    handleLambdaChange(event) {
        this.setState({lambda: Number(event.target.value)});
    }

    handleGammaChange(event) {
        this.setState({gamma: Number(event.target.value)});
    }

    rlsExecute(x, d, L, lambda, gamma) {
        const N = x.length;
        let e = math.zeros(1, N);
        let y = math.zeros(1, N);
        let ff = math.zeros(L, N);

        let f_n = math.zeros(L);
        let x_n = Array.apply(null, Array(L)).map(Number.prototype.valueOf,0);

        let P = math.multiply(gamma, math.identity(L));
        let alpha_n = 0;
        for (let n = 0; n < N; n++) {
            x_n.unshift(x[n]);
            x_n.pop();
            
            y._data[0][n] = math.multiply(math.transpose(f_n), x_n);
            e._data[0][n] = d[n] - y._data[0][n];
            alpha_n = 1 / (lambda + math.multiply(
                math.multiply(math.transpose(x_n), P),x_n));
            f_n = math.add(f_n, math.multiply(math.multiply((alpha_n* e._data[0][n]), P), x_n));


            P = math.multiply((1/lambda), math.subtract(P, 
                math.multiply(math.multiply(math.multiply(math.multiply(alpha_n, P), x_n), math.transpose(x_n)), P)));
            
            for(let i = 0; i < 10; i++) {
                ff._data[i][n] = f_n._data[i];
            }
        }
    
        const _est = this.mapSignalToChartData(e._data[0]);
        const _y = this.mapSignalToChartData(y._data[0]);
        const _x = this.mapSignalToChartData(signals.x);
        const _d = this.mapSignalToChartData(signals.d);
        this.setState({ results: {e: _est, y: _y, ff: ff, d: _d, x: _x} });
    }

    mapSignalToChartData(signal) {
        return signal.map((obj, index) => (
            {nr_probki: index+1, res: obj}
        ));
    }

    componentDidMount() {
        this.rlsExecute(signals.x, signals.d, this.state.L, this.state.lambda, this.state.gamma);
    }

    componentDidUpdate(prevProps, prevStates) {
        if(this.state.L !== prevStates.L || this.state.lambda !== prevStates.lambda || this.state.gamma !== prevStates.gamma) {
            this.rlsExecute(signals.x, signals.d, this.state.L, this.state.lambda, this.state.gamma);
        }
    }

    handleChart(e) {
        if(e.target.checked) {
            this.setState({ chart: e.target.value });
        }
    }

    render() {
        
    return (
      <div className="rls col-md-12">
        <form>
            <label>
                L:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.L}
                    onChange={this.handleLChange}
                    min={10} max={100} step={1} />
            </label><br/>
            <label>
                &lambda;: (for &lambda; = 1 it is a simple RLS)
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.lambda}
                    onChange={this.handleLambdaChange}
                    min={0.01} max={1} step={0.01} />
            </label><br/>
            <label>
                &gamma;:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.gamma}
                    min={1} max={1000} step={100}
                    onChange={this.handleGammaChange} />
            </label><br/>
        </form>
        <form className={"radios"}>
            <label>
                <input type="radio" value="e" checked={this.state.chart === "e"} onChange={this.handleChart}/>
                error estimate
            </label>
            <label>
                <input type="radio" value="y" checked={this.state.chart === "y"} onChange={this.handleChart}/>
                output signal
            </label>
            <label>
                <input type="radio" value="x" checked={this.state.chart === "x"} onChange={this.handleChart}/>
                input signal
            </label>
            <label>
                <input type="radio" value="d" checked={this.state.chart === "d"} onChange={this.handleChart}/>
                reference signal
            </label>
        </form>
        {
            this.state.results ?
            <div className="row">
                <div className="col-sm">
                    <LineChart width={800} height={500} data={this.state.results[this.state.chart]}>
                        <XAxis dataKey="nr_probki"/>
                        <YAxis/>
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                        <Line
                            dot={ false }
                            type="monotone"
                            dataKey="res"
                            stroke="#8884d8" />
                    </LineChart>
                </div>
            </div>
            : null
        }
        
      </div>
    );
  }
}

export default RLS;
/* Created by Jedrzej Klocek 20.06.2018*/