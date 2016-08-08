(function(jQuery) {

  var $ = jQuery;

  var tour = new Tour({
    name: 'gene-to-phylotree-to-context-viewer',
    keyboard: true,
    debug: true,
    orphan: true,
    steps : [
      {
	path: '/tours',
	title: 'Phylotree Tour: Welcome to LIS!',
	content: 'Let\'s go the legumeinfo.org homepage, where the Phylotree Tour will begin.  Use the Next button or &#8594; (right arrow key) to advance the tour. Use the Prev button or &#8592; (left arrow key) to step back.',
	placement: 'bottom',
	element: '#site-name',
	reflex: true,	
      }, {
	path: '/home',
	title: 'Phylotree Tour: Getting started',
	content: "This tour will provide an example of navigating LIS from a gene annotated with a specific function to views of its evolutionary context both with respect to other individual genes as well as to the genomic context in which it occurs.<br> Now press the Gene Search button, or use the Next button or press &#8594;.",
	placement: 'bottom',
	element: "a:contains('Gene Search')",
        reflex: true,
      }, {
	path: '/search/gene',
	title: 'Phylotree Tour: Gene Search',
	content: 'All the legume genes in LIS have been annotated with functional descriptors based on a consistent set of homology-based methods. We can enter key terms from the expected description of gene function here.',
	placement: 'bottom',
	element: '#edit-description',
	reflex: true,
	onShown: function(tour) {
          $('#edit-description')[0].value='gamma-glutamyl transpeptidase';
	},
      }, {
	title: 'Phylotree Tour: Gene Search',
	content: 'Then click "Apply" to apply the specified filter to the genes in the result.',
	placement: 'bottom',
	element: '#edit-submit-gene',
	reflex: true,
	onNext: function() {
          $('#edit-submit-gene')[0].click();
	}
      }, {
        title: 'Phylotree Tour: Gene Search',
        content: 'Please be patient, as we wait for the query results to be returned...',
	placement: 'top',
	onShown: function(tour) {
          $('.popover-navigation div').hide();
	  // wait for dynamic content with a loading dialog.
	  if(tour.skipStep) {
	    tour.skipStep = false;
	    tour.prev();
	    return;
	  }
	  var promise = lisTours.waitForContent(
	    tour,
	    function() {
	      return $('tr.odd:nth-child(1) > td:nth-child(7):contains(\'gamma-glutamyl transpeptidase\')')[0];
	    });
	  // advance automatically to next step when done loading
	  promise.then(function() {
	    tour.next();
	  });
	  return promise;
	}
      }, {
	title: 'Phylotree Tour: Search Results',
	content: "We've gotten paged results back for all species with annotated genomes in LIS. ",
	element: '#block-system-main > div > div > div.view-content > table > thead > tr > th.views-field.views-field-name.active > a',
	placement: 'top',
        onPrev: function(tour) {
          tour.skipStep = true;
        }
      }, {
	title: 'Phylotree Tour: Filter by Species',
	content: "Supposing we are initially interested in the genes from Vigna radiata (mungbean), we would specify the five-letter species abbreviation 'vigra', composed of the first three letters of the genus and the first two letters of the species component of the scientific name.",
	onShow: function() {
          $("#edit-abbreviation")[0].value='vigra';
	},
	element: '#edit-abbreviation',
	placement: 'bottom',
	reflex: true,	
	onPrev: function(tour) {
	  tour.skipStep = true;
	}
      }, {
	title: 'Phylotree Tour: Gene Search',
	content: 'Again click "Apply" to apply the added filter to the genes in the result.',
	placement: 'bottom',
	element: '#edit-submit-gene',
	reflex: true,	
	onNext: function() {
          $('#edit-submit-gene')[0].click();
	}
      }, {
        title: 'Phylotree Tour: Gene Search',
        content: 'Waiting for query results...',
	placement: 'top',
	onShown: function(tour) {
          $('.popover-navigation div').hide();
	  // wait for dynamic content with a loading dialog.
	  if(tour.skipStep) {
	    tour.skipStep = false;
	    tour.prev();
	    return;
	  }
	  var promise = lisTours.waitForContent(
	    tour,
	    function() {
	      return $('tr.odd:nth-child(1) > td:nth-child(1) > a:nth-child(1):contains(\'vigra\')')[0];
	    });
	  // advance automatically to next step when done loading
	  promise.then(function() {
	    tour.next();
	  });
	  return promise;
	}
       }, {
     title: 'Phylotree Tour: Functional description',
     content: "Notice that there is a subtle difference in the annotation of one gene with respect to the two others, though they are all listed as belonging to the same gene family.",
     placement: 'top',
     element: "th.views-field-description",
     onPrev: function(tour) {
       tour.skipStep = true;
     },
      }, {
	title: 'Phylotree Tour: Gene Family',
	content: "Following the link to the gene family will show you this gene in the context of a tree representing the orthologous, paralogous and homoeologous members of the family.",
	placement: 'left',
	element: "tr.even > td:nth-child(6)",
      }, {
        title: 'Phylotree Tour: Phylotree',
	path: '/chado_phylotree/phytozome_10_2.59088092?hilite_node=vigra.Vradi01g03360.1',
        content: 'Waiting for tree display...',
	placement: 'top',
	onShown: function(tour) {
          $('.popover-navigation div').hide();
	  // wait for dynamic content with a loading dialog.
	  if(tour.skipStep) {
	    tour.skipStep = false;
	    tour.prev();
	    return;
	  }
	  var promise = lisTours.waitForContent(
	    tour,
	    function() {
	      return $('#phylogram text:contains("Vradi01g03360.1")')[0];
	    });
	  // advance automatically to next step when done loading
	  promise.then(function() {
	    tour.next();
	  });
	  return promise;
	}
      }, {
	title: 'Phylotree Tour: Phylotree',
	placement: 'right',
	content : 'Here is our gene again, surrounded by orthologues from other species. ',
	element : 
	  '#phylogram text:contains("vigra.Vradi01g03360.1")',
	onPrev: function(tour) {
	  tour.skipStep = true;
	},
      }, {
	title: 'Phylotree Tour: Phylotree',
	placement: 'right',
	content : 'Notice that the two other instances of the gene family from mungbean are in a separate clade. This suggests that the gene was duplicated in an ancestral species and the two copies were retained in most of the species (possibly with subsequent duplications within some of the descendant species). This could be due to an important difference in function that evolved after the ancient duplication occurred.',
	element : 
	  '#phylogram text:contains("vigra.Vradi02g12890.1")',
      }, {
	title: 'Phylotree Tour: Phylotree',
	placement: 'right',
	content : 'The nodes of the tree representing the genes (as well as the internal ancestral nodes) can be clicked for more options.',
	element : 
	  '#phylogram text:contains("vigra.Vradi01g03360.1")',
        reflex: true,
	onNext: function() {
	  /* trigger click event on the leaf node, to reveal the dialog in
	     the correct location. need workaround for 3d and jquery
	     handling events differently :/
	     http://stackoverflow.com/questions/9063383/how-to-invoke-click-event-programmatically-in-d3
	  */
	  $.fn.d3Click = function () {
	    this.each(function (i, e) {
	      var evt = new MouseEvent('click');
	      e.dispatchEvent(evt);
	    });
	  };
debugger;
	  $('#phylogram g.leaf:contains("Vradi01g03360.1")').d3Click();
	  var promise = lisTours.waitForContent(
	    tour,
	    function() {
	      return $("#phylonode_popup_dialog a[href*='lis_context_viewer']")[0];
	    });
	  // advance automatically to next step when done loading
	  promise.then(function() {
              //for reasons adf doesn't entirely understand, we don't need to
              //invoke the tour.next here and in fact doing so gives the double
              //click phenomenon where the popup appears and then gets re-invoked
	      //tour.next();
	  });
	  return promise;
	}
      }, {
	title: 'Phylotree Tour: Genomic Contexts',
	content: 'We get a popup with a number of options relevant to the gene.',
	element: "#phylonode_popup_dialog",
	placement: 'bottom',
      }, {
	title: 'Phylotree Tour: Genomic Contexts',
	content: 'Let\'s follow the link for similar genomic contexts',
	element: "#phylonode_popup_dialog a[href*='lis_context_viewer']",
	reflex: true,
	placement: 'right',
      }, {
	path: '/lis_context_viewer/index.html#/search/vigra.Vradi01g03360?numNeighbors=8&numMatchedFamilies=6&numNonFamily=5&algorithm=repeat&match=5&mismatch=-1&gap=-1&score=25&threshold=25&track_regexp=&order=chromosome',
	//path: RegExp("\/lis_context_viewer\/index.html#\/search"),
	//path: /\/lis_context_viewer\/index.html#\/search/,
	title: 'Phylotree Tour: Gene Search',
        content: 'Please be patient, as we wait for the page to load...',
        placement: 'top',
        onShown: function(tour) {
          $('.popover-navigation div').hide();
          // wait for dynamic content with a loading dialog.
          if(tour.skipStep) {
            tour.skipStep = false;
            tour.prev();
            return;
          }
          var promise = lisTours.waitForContent(
            tour,
            function() {
	      return $('g.gene:has(:contains("Vradi01g03360")) > path');
            });
          // advance automatically to next step when done loading
          promise.then(function() {
            tour.next();
          });
          return promise;
        }
      },{
        //path : '/lis_context_viewer/index.html#/search/vigra.Vradi01g03360?numNeighbors=8&numMatchedFamilies=6&numNonFamily=5&algorithm=repeat&match=5&mismatch=-1&gap=-1&score=25&threshold=25&track_regexp=&order=chromosome',
	title: 'Phylotree Tour: Context Viewer',
	content: 'Our gene is front and center, highlighted among the neighboring genes from the same region on the chromosome. All genes are color coded according to the gene families to which they belong.',
	//element: $('.rail')[250],
	element: 'g.gene:has(:contains("Vradi01g03360")) > path',
	placement: 'top',
        onPrev: function(tour) {
          tour.skipStep = true;}
      }, {
	title: 'Phylotree Tour: More Help',
	content: 'If you would like to learn how to use the features of the Context viewer, you can take the Help Tour',
	element: '#helpbtn',
	placement: 'bottom'
     }
    ]
  });


  lisTours.register(tour);
  
}(window.__jquery));

