# VizProfiledEmail
a visualisation approach of data mining from emails

### Developments
1. cd to the root of this project
2. `npm install`
3. make sure you have installed `webpack` and `webpack-dev-server` installed globally. If not, `npm install webpack -g` and `npm install webpack-dev-server -g`
4. to run code and watch changes `wepack-dev-server`
5. open browser and go to `http://localhost:8080/webpack-dev-server`
6. edit the files in `./src` to see if the web page changed.

### Release
`webpack` to pack all the files into `bundle.js` at the root

### TODOs

* use [Redux](http://redux.js.org) as the store, [ref](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html?utm_source=semaphoreci&utm_medium=social&utm_campaign=sharingiscaring)
* use Promise in dataService to dispatch changes into the Redux store
* write other methods which unitize these algorithms to refactor the topology of nodes/links and dispatch changes into the Redux store
    * topological sort by <https://mgechev.github.io/javascript-algorithms/module-graphs_others_topological-sort.html?
    * clustering by [unsupervised machine learning](http://www.sthda.com/english/wiki/hierarchical-clustering-essentials-unsupervised-machine-learning)
    * clustering by DBSCAN
        * <https://github.com/upphiminn/jDBSCAN>
        * <https://github.com/LukaszKrawczyk/density-clustering>
    * clustering by K-means or Hierarchical
        * <https://github.com/harthur/clusterfck>
    * Relevance Scoring (for phrases classification?)
    * Sentiment analysis: <https://www.burakkanber.com/blog/machine-learning-sentiment-analysis/>