/* global window */
/* global cast */

import React, { Component } from 'react'
import ReactPlayer from 'react-player'

/**
 * Receiver app allows for playing iframe based content(youtube/vimeo....) as well as plain media content supported by chromecast
 * Shows an error when current url cannot be cast
 */

export default class CastReceiver extends Component {
	
	constructor(props) {
		super(props)
		this.state={
			playing: false,
			progress: 0,
			volume: 0.5,
			mute: false,
			url: null,
			type: '', // media, iframe, redirect
		}
		this.player = React.createRef();
		this.lastSenderId = 0;
		this.timer = null;
		this.onReady = this.onReady.bind(this)
	}
	
	componentDidMount() {
		let that = this;
		window.onload = function() {
			
			// bind to custom message listener for media control
			const CUSTOM_CHANNEL = 'urn:x-cast:com.syntithenai.castplayer';
			const context = cast.framework.CastReceiverContext.getInstance();
			context.addCustomMessageListener(CUSTOM_CHANNEL, function(customEvent) {
			  this.lastSenderId = customEvent.senderId;
				//console.log(['CUSTOM EVENT',customEvent])
			  let msg = customEvent.data;
			  // respond via message
			  context.sendCustomMessage(CUSTOM_CHANNEL,customEvent.senderId, 'ok CUSTOM');
				//if (this.timer) clearInterval(this.timer);
				//this.timer = setInterval(function() {
					//context.sendCustomMessage(CUSTOM_CHANNEL,customEvent.senderId, 'timer message');
				 //},3000);
				
				console.log(['CUSTOM EVENT sent message',msg])
				// exit cast session by redirecting to other page
				if (msg.type === 'redirect') {
					updateLocation(msg.url);
				// play media using react-player
				} else if (msg.type === 'media' ) {
					let newState = that.state;
					newState.type = 'media'
					if (msg.url) newState.url = msg.url;
					if (msg.playing) newState.playing = msg.playing;
					if (msg.progress) newState.progress = msg.progress;
					if (msg.volume) newState.volume = msg.volume;
					if (msg.mute) newState.mute = msg.mute;
					that.setState(newState);
				// open url in iframe
				} else if (msg.type === 'iframe') {
					console.log(['CUSTOM EVENT IFRAME',msg.url])
					let newState = that.state;
					newState.type = 'iframe'
					newState.url = msg.url;
					that.setState(newState);
				} else {
					console.log('Invalid message type')
					 context.sendCustomMessage(CUSTOM_CHANNEL,customEvent.senderId, 'invalid message type');
			
				}
			});
			context.start();
			
		  // Set the window location to the URL
		  // warning: this reciever dies essentially, because you navigated away
		  function updateLocation(url) {
			window.castReceiverManager.setApplicationState('Now Playing: ' + url);
			window.location.href = url;
		  }
		}
	}
	
	onError(e) {
		console.log(['ONerror',e])
		
		//window.messageBus.send(this.lastSenderId, {error:e});
	}
	
	onProgress(progress) {
		console.log(['ONprogress',progress])
		//window.messageBus.send(this.lastSenderId, {progress:progress});
	}
	
	onReady() {
		console.log(['ONready',this.player.current,this.state.progress])
		// seek to when loaded
		//if (this.player.current && this.state.progress > 0) {
			//this.player.current.seekTo(this.state.progress)
		//}
	}
	
	render() {
		
		//return <b>HI THERE</b>
		//width:'100%',height:'100%',padding:0,margin:0,overflow:'hidden',
		//style={{width:'100%',height:'100%'}}  iframe
		if (this.state.type === 'iframe') {
			return <div style={{width:'100%',height:'100%',backgroundColor:'yellow'}}><iframe  src={this.state.url} frameBorder='0' scrolling='no' marginHeight='0' marginWidth='0' seamless='seamless' id='iframe'></iframe></div>
					
			
		} else if (this.state.type === 'reactplayer' && this.state.url && this.state.url.length > 0) {
			//,progress:this.state.progress
			let extraParams={
				playing:this.state.playing,volume:this.state.volume,muted:this.state.mute,
				onError:this.onError,
				onProgress:this.onProgress,
				onReady:this.onReady
			};
			//return <b>{this.state.url}</b>
			return <div style={{width:'100%',height:'100%',backgroundColor:'pink'}}><ReactPlayer style={{width:'100%',height:'100%'}} url={this.state.url} ref={this.player}  {...extraParams} /></div>
		} else { //if (this.state.type === 'media' && this.state.url && this.state.url.length > 0) {
			//,progress:this.state.progress
			let extraParams={
				playing:this.state.playing,volume:this.state.volume,muted:this.state.mute,
				onError:this.onError,
				onProgress:this.onProgress,
				onReady:this.onReady
			};
			//return <b>{this.state.url}</b>
			return <div style={{width:'100%',height:'100%',backgroundColor:'lightgreen'}}><cast-media-player></cast-media-player></div>
		//} else {
			//return <b>Ready</b>
		}
	}
}
