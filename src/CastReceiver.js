/* global window */
/* global cast */

import React, { Component } from 'react'

export default class CastReceiver extends Component {
	
	componentDidMount() {
		window.onload = function() {
			window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
			castReceiverManager.onReady = function(event) {
			  window.castReceiverManager.setApplicationState('URL Cast ready...');
			};
			// messages on a custom namespace
			var ns = 'urn:x-cast:com.url.cast';
			window.messageBus = window.castReceiverManager.getCastMessageBus(ns);
			window.messageBus.onMessage = function(e) {
			  var msg = JSON.parse(e.data);
			  window.messageBus.send(e.senderId, 'ok');
			  if (msg.type === 'iframe') updateFrame(msg.url);
			  if (msg.type === 'loc') updateLocation(msg.url);
			};
			// initialize CastReceiverManager
			window.castReceiverManager.start({statusText: 'URL Cast starting...'});
		  };
		  // Update the iframe src
		  // warning: watch out for X-Frame-Options -> DENY
		  function updateFrame(url) {
			window.castReceiverManager.setApplicationState('Now Playing: ' + url);
			document.getElementById('iframe').src = url;
		  }
		  // Set the window location to the URL
		  // warning: this reciever dies essentially, because you navigated away
		  function updateLocation(url) {
			window.castReceiverManager.setApplicationState('Now Playing: ' + url);
			window.location.href = url;
		  }
	}
	
	render() {
			return <div style={{width:'100%',height:'100%',padding:0,margin:0,overflow:'hidden',backgroundColor:'#FFF'}}>
				<iframe style={{width:'100%',height:'100%'}} src='' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' seamless='seamless' id='iframe'></iframe>
			</div>
	}
	
	
}
