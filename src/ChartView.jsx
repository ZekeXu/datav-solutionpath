import React, {PureComponent, createRef} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class ChartView extends PureComponent {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
  }
  
  componentDidMount() {
    if (this.props.data) {
      this.initChart(this.props.data);
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const childs = Array.from(this.chartRef.current.childNodes);
      childs.forEach(c => {
        this.chartRef.current.removeChild(c);
      })
      this.initChart(this.props.data);
    }
  }

  formatData(data) {
    const nodes = [];
    const links = [];
    Object.keys(data.nodes).forEach((key, i) => {
      data.nodes[key].forEach((n) => {
        nodes.push({
          id: n.id,
          group: i + 1,
          name: `[${key}]_${n.name || ' '}`,
        });
      });
    });

    data.edges.forEach(e => {
      links.push({
        source: e.from.id,
        target: e.to.id,
      });
    });

    return {
      nodes,
      links,
    };
  }
  
  color() {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
  }

  renderChart(data) {
    const width = 1140;
    const height = 600;

    const links = data
      .links
      .map(d => Object.create(d));
    const nodes = data
      .nodes
      .map(d => Object.create(d));
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));


    const svg = d3.select(this.chartRef.current);

    // svg.append('defs').append('marker')
    // // .attr({'id':'arrowhead',
    // //     'viewBox':'-0 -5 10 10',
    // //     'refX':13,
    // //     'refY':0,
    // //     'orient':'auto',
    // //     'markerWidth':13,
    // //     'markerHeight':13,
    // //     'xoverflow':'visible'})
    // .append('svg:path')
    // .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    // .attr('fill', '#999')
    // .style('stroke','none');

  //   svg.append("svg:defs").selectAll("marker")
  //   .data(["end"])      // Different link/path types can be defined here
  // .enter().append("svg:marker")    // This section adds in the arrows
  //   .attr("id", String)
  //   .attr("viewBox", "0 -5 10 10")
  //   .attr("refX", 15)
  //   .attr("refY", -1.5)
  //   .attr("markerWidth", 6)
  //   .attr("markerHeight", 6)
  //   .attr("orient", "auto")
  // .append("svg:path")
  //   .attr("d", "M0,-5L10,0L0,5");

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("marker-end", "url(#end)");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", this.color())
      .call(this.drag(simulation));

      node
      .append("title")
      .text(d => d.name + '_' + d.id);
    
    const text = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('file', '#0000ff')
      .attr('width', 10)
      .attr('height', 10)
      .text(d => d.name + '_' + d.id.substr(-10));

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
      text
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
    // invalidation.then(() => simulation.stop());
    return svg.node();
  }

  drag(simulation) {
    function dragstarted(d) {
      if (!d3.event.active) 
        simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) 
        simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  initChart(data) {
    // d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json").then((data) => {
    //   this.renderChart(data);
    // });

    this.renderChart(this.formatData(data));
  };

  render() {
    return (<svg
      ref={this.chartRef}
      style={{
      width: 1140,
      height: 600,
      backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
    }}/>);
  }
}

ChartView.defaultProps = {
  data: null,
}

ChartView.propTypes = {
  data: PropTypes.shape(PropTypes.any),
}

export default ChartView;