

// set the dimensions and margins of the graph
const width = 1100 ,
      height = 845 ;

// append the svg object to the body of the page
const svg = d3.select("#tile-map")
              .append("svg")
              .attr("width", width )
              .attr("height", height )
              .attr("id", "svgElement")


// read json data
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then(function(data) {


  //sort data by how many games
  (data.children).sort((a, b) => ((b.children).length) - ((a.children).length))

  // Give the data to this cluster layout:
  const root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
   // .padding(2)
    (root)

  //fill rectangles
  const categories = (data.children).map(d => d.name)

  const colorScale = d3.scaleSequential()
                  .domain([0,17])
                  .interpolator(d3.interpolateRainbow);
                 

  // add rectangles:

  
  svg.append("g")
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "white")
      .style("fill", d => colorScale(categories.indexOf(d.data.category)))
      .style("opacity", "0.8")

//text labels

d3.select("body")
  .append("div")
  .attr("id", "text-labels")

d3.select("#text-labels")
  .selectAll("div")
  .data(root.leaves())
  .enter()
  .append("div")
  .attr("class", "label")
  .attr("data-value", d => d.data.value)
  .text(d => d.data.name)
  .style('left', function (d) { return (d.x0 + 3) + "px"; })
  .style('top', function (d) { return (d.y0 + 3 )+ "px"; })
  .style('width', function (d) { return (d.x1 - d.x0 - 10)+"px"; })
  .style('height', function (d) { return (d.y1 - d.y0 - 3)+"px"; })
   
//tooltip

d3.select("#tile-map")
  .append("div")
  .attr("id", "tooltip")   

d3.selectAll(".label")
  .on("mousemove", (e, d) => {
            d3.select("#tooltip")
              .text(formulate(d))
              .style("opacity", "0.9")
              .attr("data-value", d.data.value)
                .style("left", (e.pageX - 90 ) + "px")
                .style("top", (e.pageY - 150 ) + "px")
    })
  .on("mouseout", () => {
          d3.select("#tooltip")
              .style("opacity", "0")
    })

                           
//legend

const svgLegend = d3.select("body")
                    .append("svg")
                    .attr("width", width )
                    .attr("height", 400)
                    .attr("id", "legend")

           svgLegend.selectAll("rect")
                    .data(categories)
                    .enter()
                    .append("rect")
                    .attr("class", "legend-item")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", d => colorScale(categories.indexOf(d)))
                    .attr("x", (d, i) => (i%3)* 200  + width / 3)
                    .attr("y",(d, i) => (( i % categories.length - i % 3) * 10 + 25))
                    
        svgLegend.selectAll("text")
                  .data(categories)
                  .enter()
                  .append("text")
                  .text(d => d)
                  .attr("fill", "black")
                  .attr("x", (d, i) => (i%3)* 200  + width / 3 + 25)
                  .attr("y",(d, i) => (( i % categories.length - i % 3) * 10 + 40))

        

function formulate(d) {
  let s = "Name: " + d.data.name + "\n"
  s+= "Category: " + d.data.category + "\n"
  s+= "Value: " + d.data.value + "\n"

  return s
 }  

})