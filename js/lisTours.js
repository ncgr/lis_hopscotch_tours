"use strict";

/* 
  lisTours

  - use a cookie to track which tour the user is following.
  - call hopscotch with the javascript tour definition object.
  - allow dynamically evaluated tour step targets.
  - remove the cookie when tour ends.

  Usage: lisTours.go('tour2');

  requirements:

  hopscotch.js and CSS : cdnjs.cloudflare.com/ajax/libs/hopscotch
  js.cookie : cdnjs.cloudflare.com/ajax/libs/js-cookie
  jQuery : cdnjs.cloudflare.com/ajax/libs/jquery or use drupal jquery
  
 */

var tour = null; /* the tour scripts load into a global var named tour */
var lisTours = {}; /* the tour wrapper/launcher, created by this module */

(function(){

  var LOGGING = true;

  if(LOGGING) {
    console.log('lisTours.js loading');
  }
  
  var that = this;
  var WAIT_MS = 100;
  var MAX_WAIT_MS = 10000;
  var COOKIE_ID = 'lis-multipage-tour';
  var timerId = null;
  var waitCounter = 0;
  
  if(! 'hopscotch' in window) {
    throw 'hopscotch is required';
  }
 
  this.tourId = Cookies.get(COOKIE_ID);

  this.cleanup = function() {
    // prevent tour from re-appearing on every page load!
    if(LOGGING) {
      console.log('cleanup() removing cookie ' + COOKIE_ID);
    }
    Cookies.remove(COOKIE_ID);
    if(timerId) {
      if(LOGGING) {
	console.log('cleanup() clearing timer id');
      }
      // stop wait for target
      clearTimeout(timerId);
      timerId = null;
    }
  };

  /* wakeup() : a helper function to be used from tour onNext or
   * onPrev. Use this in the case of dynamic target, and the
   * window.location is not changing. */ 
  this.wakeup = function() {
    var stepNum = hopscotch.getCurrStepNum();
    that.updateStepTarget(stepNum);
  };
  
  /* updateStepTarget() : Returns the resolved target dom element, if any. */
  this.updateStepTarget = function(stepNum) {
    if(LOGGING) {
      console.log('updateStepTarget() stepNum=' + stepNum);
    }
    var state = hopscotch.getState();
    if(state) {
      var parts = state.split(':');
      var tourId = parts[0];
      if(tourId !== that.tourId) {
	throw 'tourId is invalid';
      }
      if(stepNum === undefined) {
	stepNum = parseInt(parts[1]);
      }
    }
    if(stepNum === undefined) {
      stepNum = 0;
    }
    var step = tour.steps[stepNum];
    var target = step.target;
    var el = null;
    switch(typeof target) {
    case 'string':
      // string should be an id of dom element.
      var el = jQuery('#'+target)[0];
      if(! el) {
	if(LOGGING) {
	  console.log('waiting for target id: ' +target);
	}
      }
      break;
    case 'function':
      var el = target();
      if(el) {
	// update the step target because hopscotch doesnt support
	// callback function for tour step.
	step.target = el;
      }
      else {
	if(LOGGING) {
	  console.log('waiting for target callback fn:');
	  console.log(target);
	}
      }
      break;
    case 'object':
      // apparently this step target is already a dom element, which
      // hopcotch can handle.
      el = target;
      break;
    }
    return el;
  };
  
  /* go(): resume the tourId at a specific step number (default is to
     resume) */
  this.go = function(tourId, stepNum) {

    if(timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    
    that.tourId = tourId;

    if(LOGGING) {
      console.log('lisTours.go(' + tourId + ', ' + stepNum + ')');
    }

    // check if hopscotch is in agreement about the current tourid
    var state = hopscotch.getState();
    if(state) {

      if(LOGGING) {
	console.log('current hopsotch state: '+ state);
      }
      var parts = state.split(':');
      if(parts[0] !== tourId) {
	// end previous tour
	try { hopscotch.endTour(true);  } catch(e) {}
      }
      if(stepNum === undefined) {
	// extract the stepNum from the state object
	stepNum = parseInt(state.split(':')[1]);
	if(LOGGING) {
	  console.log('resuming at step n=' + stepNum);
	}
      }
      if(stepNum === undefined) {
	throw 'failed to resolve stepNum';
      }
    }
    else {
      stepNum = 0;
    }
    
    Cookies.set(COOKIE_ID, tourId, { expires: 365 });
    var url = '/lis-tours/' + tourId + '/js';
    jQuery.getScript(url, function() {
      
      if(! tour) {
	throw 'failed to load tour: ' + tourId;
      }
      if(LOGGING) {
	console.log(tour);
      }
      
      // force the tour to cleanup so user does not see tour re-appear
      // upon every page load.
      tour.onClose = that.cleanup;
      tour.onEnd = that.cleanup;

      var el = that.updateStepTarget();
      
      // if target could not be resolved, check again after wait,
      // until the max wait time.
      if(! el) {
	waitCounter += WAIT_MS;
	if(waitCounter >= MAX_WAIT_MS) {
	  try { hopscotch.endTour(true); } catch(e) {}
	  that.cleanup();
	  throw 'error: exceeded max wait ms for target';
	}
	timerId = setTimeout(function() { that.go(tourId, stepNum); },
			     WAIT_MS);
	return;
      }
      if(LOGGING) {
	console.log('starting tour with dom element: ');
	console.log(el)
      }
      hopscotch.startTour(tour, stepNum);
    });
  }
    
  if(this.tourId !== undefined) {
    if(LOGGING) {
      console.log(this.tourId);
    }
    this.go(this.tourId);
  }
  else {
    if(LOGGING) {
      console.log('no tourId');
    }
  }

}.call(lisTours));
