import React from 'react'

class Visualizer extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentDidMount () {
    var cpu = 8 // 最大cpu數量
    var w = 600
    var h = 400
    var padding = 40
    var input
    var dataset = [
            [0, 0, 0, 1, 8], [1, 0, 1, 235, 3],
            [2, 0, 1, 222, 1], [3, 0, 1, 212, 2],
            [4, 0, 236, 100, 2], [5, 0, 336, 74, 6],
            [6, 0, 410, 2, 1], [7, 0, 412, 29, 1],
            [8, 0, 441, 182, 8], [9, 0, 623, 1, 1]
    ] // 數據[ID,x軸位置,開始時間,執行時間,cpu數目]
                 // 0     1        2        3       4
    var numTask = d3.max(dataset, function (d) { return d[0] })
    var maxtime = d3.max(dataset, function (d) { return d[2] + d[3] }) // 總執行時間

    var xScale = d3.scale.linear()          // x軸比例尺
            .domain([0, cpu])                   // 輸入的範圍
            .range([padding, w - padding * 2]) // 對照的長度
    var yScale = d3.scale.linear()          // y軸比例尺
            .domain([maxtime, 0])
            .range([padding, h - padding])
        // d3.max(dataset, function (d) { return d[1]; })//

        // 不要重疊
    var i = 0
    var j
    for (i = 1; i <= numTask; i++) {
      j = dataset[i - 1][2] + dataset[i - 1][3]
      if (j > dataset[i][2]) {
        dataset[i][1] = dataset[i - 1][1] + dataset[i - 1][4]
      }
    }

        // 創svg
    var svg = d3.select(this.refs.container)
            .append('svg')
            .attr('width', w)
            .attr('height', h)

        // 創長方形
    svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', function (d) {
              return xScale(d[1])
            })
            .attr('y', function (d) {
              return yScale(d[2] + d[3])
            })
            .attr('width', function (d) {
              return xScale(d[4]) - padding
            })
            .attr('height', function (d) {
              return d[3] * ((h - padding * 2) / maxtime)
            })
            .style({
              fill: 'steelblue',
              stroke: 'MidnightBlue',
              'stroke-width': 1
            })

        /* .attr("fill", function (d) {
            return "rgb(0, 0, " + ((d[0]*5+5) * 10) + ")";
        }); */

        // 創文字(中間task編號)
    svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text(function (d) {
              return d[0]
            })
            .attr('x', function (d) {
              return xScale(d[1]) + (xScale(d[4]) - padding) / 2
            })
            .attr('y', function (d) {
              return (yScale(d[2]) - (d[3] * ((h - padding * 2) / maxtime)) / 2) + 6
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', '20px')
            .attr('fill', 'black')

        /*
              //右上執行時間
              svg.selectAll("text")
                  .data(dataset)
                  .enter()
                  .append("text")
                  .text(function (d) {
                      return d[2]+d[3];
                  })
                  .attr("x", function (d) {
                      return xScale(d[1]) + xScale(d[4]) - padding+10;
                  })
                  .attr("y", function (d) {
                      return (yScale(d[2]) - (d[3] * ((h - padding * 2) / maxtime)));
                  })
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "10px")
                  .attr("fill", "red")
       */

        // 定義x軸
    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(cpu)

        // 定義y軸
    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
        // .tickValues([function (d) { return d[2];}])
        //  .ticks(8);

        // 創x軸
    svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (h - padding) + ')')
            .call(xAxis)

        // 創y軸
    svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding + ',0)')
            /*  .tickValues(dataset[1][2]) */
            .call(yAxis)
  }
  render () {
    return (
      <div style={{'width': '100%', 'height': '600px', 'margin': '10px'}} ref='container' />
    )
  }
}

export default Visualizer
