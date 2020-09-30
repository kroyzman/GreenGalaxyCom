module.exports = {
  /* ensure that the XLSX variable is exported */
  output: {
    libraryTarget: "var",
    library: "XLSX"
  },
  /* module.noParse needed for bower */
  module: {
    noParse: [/xlsx.core.min.js/, /xlsx.full.min.js/]
  },
  /* Uncomment the next block to suppress codepage */
  /*
	resolve: {
		alias: { "./dist/cpexcel.js": "" }
	},
	*/
  /* suppress node shims */
  node: {
    fs: "empty"
  },
  externals: [
    {
      "./cptable": "var cptable"
    }
  ]
};
