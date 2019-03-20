import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
import ChartView from './ChartView';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss';
import Logo from './favicon.png';

function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch(e) {
  }
  return false;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    }

    this.handleFormat = this.handleFormat.bind(this);
  }

  handleFormat() {
    const sourceData = document.getElementsByTagName('textarea')[0].value;
    if (!isJsonString(sourceData)) {
      alert('JSON数据格式错误，请检查');
      return;
    }

    this.setState({
      data: JSON.parse(sourceData),
    });
  }


  render() {
    const { data } = this.state;

    return (
      <div className="App">
        <nav class="navbar navbar-dark bg-dark">
          <a class="navbar-brand" href="#">
            <img src={Logo} width="30" height="30" style={{ marginRight: 12 }} class="d-inline-block align-top" alt="" />
            Data visualization for SolutionPath
          </a>
        </nav>

        <main>
          <div style={{ textAlign: 'center' }}>
            {data && <ChartView
              data={data}
            />
            }
          </div>
          <div className="container no-padding">
            <div className="content">
            <div className="card no-padding">
              <textarea
                className="form-control"
                placeholder={`
                  请输入 solution path 数据，格式参考\n
                  {
                    "throttle": true,
                    "maxWaitingRequest": 1000,
                    "nodes": {
                      "entry": [{
                        "id": "UUID1",
                        "name": "Entry",
                        "description": "",
                        "config": {
                          "outputSlot": [{
                            "key": "image",
                            "type": "file"
                          }]
                        }
                      }],
                      "exit": [{
                        "id": "UUID2",
                        "name": "Exit",
                        "description": "",
                        "config": {
                          "inputSlot": [{
                            "key": "results"
                          }]
                        }
                      }],
                      "code": [{
                        "id": "UUID3",
                        "name": "code demo",
                        "description": "",
                        "type": "py",
                        "config": {
                          "fileName": "name/of/the/file/include/extension",
                          "inputSlot": [{
                            "key": "p1"
                          }],
                          "outputSlot": [{}]
                        }
                      }],
                      "model": [],
                      "static": []
                    },
                    "edges": [{
                        "from": {
                          "id": "UUID1",
                          "slot": 0
                        },
                        "to": {
                          "id": "UUID3",
                          "slot": 0
                        }
                      },
                      {
                        "from": {
                          "id": "UUID3",
                          "slot": 0
                        },
                        "to": {
                          "id": "UUID2",
                          "slot": 0
                        }
                      }
                    ]
                  }
                `}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={this.handleFormat}>Start format</button>
            </div>
            <div className="card no-padding">
              <JSONPretty id="json-pretty" data={data}></JSONPretty>
            </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
