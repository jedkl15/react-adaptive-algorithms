import React, { Component } from 'react';
import * as math from 'mathjs';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';

import signals from '../signals.json';

class NLMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            L: 10,
            alpha: 0.1,
            c: 0.1,
            results: undefined,
            chart: 'e'
        };
        this.handleLChange = this.handleLChange.bind(this);
        this.handleAlphaChange = this.handleAlphaChange.bind(this);
        this.handleCChange = this.handleCChange.bind(this);
        this.handleChart = this.handleChart.bind(this);
    }

    handleLChange(event) {
        this.setState({L: Number(event.target.value)});
    }

    handleAlphaChange(event) {
        this.setState({alpha: Number(event.target.value)});
    }

    handleCChange(event) {
        this.setState({c: Number(event.target.value)});
    }

    nlmsExecute(x, d, L, alpha, c) {
        const N = x.length;
        let e = math.zeros(1, N);
        let y = math.zeros(1, N);
        let ff = math.zeros(L, N);

        let f_n = math.zeros(L);
        let x_n = Array.apply(null, Array(L)).map(Number.prototype.valueOf,0);

        for (let n = 0; n < N; n++) {
            x_n.unshift(x[n]);
            x_n.pop();
            
            y._data[0][n] = math.multiply(math.transpose(f_n), x_n);
            e._data[0][n] = d[n] - y._data[0][n];
            
            f_n = math.add(f_n, math.multiply((1/(c + math.multiply(math.transpose(x_n), x_n))), math.multiply((alpha* e._data[0][n]), x_n)));

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
        this.nlmsExecute(signals.x, signals.d, this.state.L, this.state.alpha, this.state.c);
    }

    componentDidUpdate(prevProps, prevStates) {
        if(this.state.L !== prevStates.L || this.state.alpha !== prevStates.alpha || this.state.c !== prevStates.c) {
            this.nlmsExecute(signals.x, signals.d, this.state.L, this.state.alpha, this.state.c);
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
                &alpha;:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.alpha}
                    onChange={this.handleAlphaChange}
                    min={0.01} max={0.99} step={0.01}  />
            </label><br/>
            <label>
                c:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.c}
                    onChange={this.handleCChange}
                    min={-10} max={10} step={0.1}  />
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

export default NLMS;

/* Created by Jedrzej Klocek 20.06.2018*/