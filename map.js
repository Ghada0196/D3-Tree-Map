

// set the dimensions and margins of the graph
const width = 1100 ,
      height = 845 ;

// append the svg object to the body of the page
const svg = d3.select("body")
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

svg.append("g")
  .selectAll("text")
  .data(root.leaves())
  .join("text")
  .attr("data-name", d => d.data.name)
  .attr("data-category", d => d.data.category)
  .attr("data-value", d => d.data.value)
  .attr('x', function (d) { return d.x0 + 5; })
  .attr('y', function (d) { return d.y0 + 23; })
  .style("fill", "black")
  .text(d => d.data.name )
  
 
d3.select("body")
  .append("div")
  .attr("id", "tooltip")      
     

//tooltip
    d3.selectAll(".tile")
        .on("mouseover", (e, d) => {
       
            d3.select("#tooltip")
              .text(formulate(d))
              .style("opacity", "0.8")
              .style("left", e.pageX + "px")
              .style("top", e.pageY + "px")
              .attr("data-value", d.data.value)
                   
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