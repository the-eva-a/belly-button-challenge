// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata;

    let sampleMetadata = metadata.find(item => item.id === parseInt(sample));
    if (!sampleMetadata) {
      console.error("No metadata found for sample:", sample);
      return;
    }

    let panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let samples = data.samples;

    let sampleData = samples.find(item => item.id === sample.toString());
    if (!sampleData) {
      console.error("No data found for sample:", sample);
      return;
    }

    let otuIds = sampleData.otu_ids;
    let otuLabels = sampleData.otu_labels;
    let sampleValues = sampleData.sample_values;

    let bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "OTU Distribution",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    let yticks = otuIds.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let barValues = sampleValues.slice(0, 10).reverse();
    let barLabels = otuLabels.slice(0, 10).reverse();

    let barTrace = {
      x: barValues,
      y: yticks,
      text: barLabels,
      type: "bar",
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Initialize the dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleNames = data.names;

    if (!sampleNames || sampleNames.length === 0) {
      console.error("No sample names found.");
      return;
    }

    let dropdown = d3.select("#selDataset");

    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
