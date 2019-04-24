/* global window */
/* global cast */
/* global chrome */

import React, { Component } from 'react';

//import { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import PLAYER_STATE from './playerStateConstants';

import PlayerHandler from './PlayerHandler'


var FULL_VOLUME_HEIGHT = 100;
/**
 * Cast player Component
 * Main variables:
 *  - PlayerHandler object for handling media playback
 *  - Cast player variables for controlling Cast mode media playback
 *  - Current media variables for transition between Cast and local modes
 * @struct @constructor
 */

export default  class CastPlayer extends Component {
    
    constructor(props) {
	
		super(props);
		let that = this;
		// local media player
		this.mediaRef = React.createRef();
		
		/** @type {PlayerHandler} Delegation proxy for media playback */
		this.playerHandler = new PlayerHandler(this);

		/** @type {PLAYER_STATE} A state for media playback */
		this.playerState = PLAYER_STATE.IDLE;

		/* Cast player variables */
		/** @type {cast.framework.RemotePlayer} */
		this.remotePlayer = null;
		/** @type {cast.framework.RemotePlayerController} */
		this.remotePlayerController = null;

		/* Current media variables */
		/** @type {number} A number for current media index */
		//this.currentMediaIndex = 0;
		/** @type {number} A number for current media time */
		this.currentMediaTime = 0;
		/** @type {number} A number for current media duration */
		this.currentMediaDuration = -1;
		/** @type {?number} A timer for tracking progress of media */
		this.timer = null;

		/** @type {Object} media contents from JSON */
		//this.mediaContents = null;

		/** @type {boolean} Fullscreen mode on/off */
		this.fullscreen = false;

		/** @type {function()} */
		//this.onPlay = this.onPlay.bind(this);
		//this.incrementMediaTimeHandler = this.incrementMediaTime.bind(this);
		
		this.setupLocalPlayer = this.setupLocalPlayer.bind(this);
		this.startProgressTimer = this.startProgressTimer.bind(this);
		this.stopProgressTimer = this.stopProgressTimer.bind(this)
		this.incrementMediaTime = this.incrementMediaTime.bind(this)
		this.endPlayback = this.endPlayback.bind(this)
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		this.togglePlayback = this.togglePlayback.bind(this)
		this.seekTo = this.seekTo.bind(this)
		//this.setupLocalPlayer();
		//this.addVideoThumbs();
		//this.initializeUI();
	}	
	
	// handle media changes and other property changes by directly manipulating the video/audio element
	// return false to prevent rerendering
	
	shouldComponentUpdate(props) {
		//console.log(['CAST PLAYER should updaate????'])

		if (props.media != this.props.media) {
			console.log(['CAST PLAYER media change',props.media])
			//return true;
			this.playerHandler.seekTo(0)
			this.playerHandler.load(props.media)
		}
		//if (typeof props.isPlaying === 'boolean' && props.isPlaying != this.props.isPlaying) {
			//if (props.isPlaying) {
				//this.playerHandler.play()
			//} else {
				//this.playerHandler.pause()
			//}
		//}
		//if (props.volume !== null && props.volume != this.props.volume) {
			//this.playerHandler.setVolume(props.volume)
		//}
		//if (props.seekTo !== null && props.seekTo != this.props.seekTo) {
			//this.playerHandler.seekTo(props.seekTo)
		//}
		return false;
	}
		
	componentDidMount() {	
		console.log(['CAST PLAYER mount'])
		console.log(['CAST PLAYER ',this.props])

		let that = this;
		//var castPlayer = new CastPlayer();
		window['__onGCastApiAvailable'] = function(isAvailable) {
			if (isAvailable) {
				that.initializeCastPlayer();
			}
		};
		this.setupLocalPlayer();
		//if (this.props.media) this.playerHandler.load(this.props.media)
		//if (props.isPlaying) {
			//this.playerHandler.play()
		//}
		//if (props.volume !== null && props.volume != this.props.volume) {
			//this.playerHandler.setVolume(props.volume)
		//}
		//let seekTo = parseFloat(this.props.seekTo,10) != NaN ? parseFloat(this.props.seekTo,10) : 0;
	//	this.currentMediaTime = seekTo;
		//this.playerHandler.seekTo(seekTo)
		//) {
			//this.playerHandler.play()
		//}
		//if (props.volume !== null && props.volume != this.props.volume) {
			//this.playerHandler.setVolume(props.volume)
		//}
		//if (props.seekTo !== null && props.seekTo != this.props.seekTo) {
			//this.playerHandler.seekTo(props.seekTo)
		//}
	}
	
	componentDidUpdate(props) {
		
	}
	
	play() {
		console.log('PLAY');
		//console.log(this.player)
		this.playerHandler.play()
	}

	pause() {
		console.log('PAUSE');
		this.playerHandler.pause()
	}
	
	togglePlayback= function() {
		if (this.props.isPlaying) {
			this.pause()
		} else {
			this.play()
		}
	}
	
	seekTo(time) {
		console.log('seek to');
		this.playerHandler.seekTo(time)
	}
	
	
	initializeCastPlayer = function() {
		console.log(['INITIALIZE CAST PLAYER '])

		var options = {};
		options.receiverApplicationId = this.props.chromecastReceiverApplicationId;
		options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
		cast.framework.CastContext.getInstance().setOptions(options);

		this.remotePlayer = new cast.framework.RemotePlayer();
		this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
		this.remotePlayerController.addEventListener(
			cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
			this.switchPlayer.bind(this)
		);
	};
	
	switchPlayer = function() {
		console.log(['SWITCH PLAYER'])
		let autoPlay = this.props.isPlaying; //(this.playerState === PLAYER_STATE.PLAYING);
		//this.stopProgressTimer();
		//this.resetVolumeSlider();
		this.playerHandler.stop();
		this.playerState = PLAYER_STATE.IDLE;
		let seekTo = this.props.seekTo - 5 > 0 ? this.props.seekTo - 5 : 0;
		this.props.onProgress(seekTo); 
		if (cast && cast.framework) {
			if (this.remotePlayer.isConnected) {
				console.log(['SWITCH PLAYER REMOTE'])
				this.props.onCast(true)
				this.setupRemotePlayer(autoPlay);
				return;
			}
		}
		console.log(['SWITCH PLAYER LOCAL'])
		this.props.onCast(false)
		this.setupLocalPlayer(autoPlay,true);
	};
	

	/**
	 * Callback when media is loaded in local player
	 */
	onMediaLoadedLocally = function(autoPlay) {
		console.log(['MEDIA LOADED LOCALLY',this.currentMediaTime])
		//var localPlayer = document.getElementById('video_element');
		var localPlayer = this.mediaRef.current; 
		//var localPlayer = this._player.current; 
		//localPlayer.currentTime = this.currentMediaTime;
		//localPlayer.seekTo(this.currentMediaTime);
		this.playerHandler.loaded(autoPlay);
	};

		
	///**
	 //* Reset the volume slider
	 //*/
	//resetVolumeSlider = function() {
		//var volumeTrackHeight = document.getElementById('audio_bg_track').clientHeight;
		//var defaultVolumeSliderHeight = DEFAULT_VOLUME * volumeTrackHeight;
		//document.getElementById('audio_bg_level').style.height =
			//defaultVolumeSliderHeight + 'px';
		//document.getElementById('audio_on').style.display = 'block';
		//document.getElementById('audio_off').style.display = 'none';
	//};


	/**
	 * Set the PlayerHandler target to use the video-element player
	 */
	setupLocalPlayer = function (autoPlay,alreadyLoaded) {
		let that = this;
		var localPlayer = this.mediaRef.current; 
		console.log(['SETUP LOCAL PLAYER',localPlayer])
		console.log(['SETUP LOCAL PLAYER ptops',this.props])

		//this._player.current; 
		//document.getElementById('video_element');
		
		//if (this.props.onEnd) localPlayer.addEventListener('ended', this.props.onEnd);
		if (this.props.onError) {
			localPlayer.addEventListener('error', this.props.onError);
		}
		//localPlayer.addEventListener('progress', function(progress) {
			//that.currentMediaTime = progress;
			//if (that.props.onProgress) that.props.onProgress(progress);
		//})

		
		// This object will implement PlayerHandler callbacks with localPlayer
		var playerTarget = {targetType:'local'};

		playerTarget.play = function() {
			localPlayer.play();
			//var vi = document.getElementById('video_image');
			//vi.style.display = 'none';
			//localPlayer.style.display = 'block';
		};

		playerTarget.pause = function () {
			console.log(['LOCALPLAYER pause'])
			localPlayer.pause();
		};

		playerTarget.stop = function () {
			console.log(['LOCALPLAYER STOP'])
			localPlayer.pause();
		};

		playerTarget.load = function(media,autoPlay) {
			localPlayer.src = media ? media.url : '';
			//	this.mediaContents[mediaIndex]['sources'][0];
			localPlayer.load();
		}.bind(this);

		playerTarget.getCurrentMediaTime = function() {
			return localPlayer.currentTime;
		};

		playerTarget.getMediaDuration = function() {
			return localPlayer.duration;
		};

		playerTarget.updateDisplayMessage = function () {
			//document.getElementById('playerstate').style.display = 'none';
			//document.getElementById('playerstatebg').style.display = 'none';
			//document.getElementById('video_image_overlay').style.display = 'none';
		};

		playerTarget.setVolume = function(volumeSliderPosition) {
			localPlayer.volume = volumeSliderPosition < FULL_VOLUME_HEIGHT ?
				volumeSliderPosition / FULL_VOLUME_HEIGHT : 1;
			//var p = document.getElementById('audio_bg_level');
			//p.style.height = volumeSliderPosition + 'px';
			//p.style.marginTop = -volumeSliderPosition + 'px';
		};

		playerTarget.mute = function() {
			localPlayer.muted = true;
		};

		playerTarget.unMute = function() {
			localPlayer.muted = false;
		};

		playerTarget.isMuted = function() {
			return localPlayer.muted;
		};

		playerTarget.seekTo = function(time) {
			localPlayer.currentTime = parseInt(time,10);
			//localPlayer.seekTo(time);
		};

		this.playerHandler.setTarget(playerTarget);
		if (!alreadyLoaded) { 
			localPlayer.addEventListener(
				'loadeddata', function(e) {that.onMediaLoadedLocally.bind(that)(autoPlay)});
		} else {
			this.playerHandler.loaded(autoPlay);
		}
		//DEFAULT_VOLUME * FULL_VOLUME_HEIGHT
		//this.playerHandler.setVolume(this.props.volume);
		//this.playerHandler.seekTo(this.props.seekTo);
		//this.showFullscreenButton();

		//if (this.playerState === PLAYER_STATE.PLAYING) {
			//this.playerHandler.play();
		//}
	};

	/**
	 * Set the PlayerHandler target to use the remote player
	 */
	setupRemotePlayer = function (autoPlay) {
		console.log(['SETUP REMOTE PLAYER',this.props])
		var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

		// Add event listeners for player changes which may occur outside sender app
		this.remotePlayerController.addEventListener(
			cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
			function() {
				if (this.remotePlayer.isPaused) {
					this.playerHandler.pause();
				} else {
					this.playerHandler.play();
				}
			}.bind(this)
		);

		this.remotePlayerController.addEventListener(
			cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
			function() {
				if (this.remotePlayer.isMuted) {
					this.playerHandler.mute();
				} else {
					this.playerHandler.unMute();
				}
			}.bind(this)
		);

		this.remotePlayerController.addEventListener(
			cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
			function() {
				var newVolume = this.remotePlayer.volumeLevel * FULL_VOLUME_HEIGHT;
				this.playerHandler.setVolume(newVolume);
				//var p = document.getElementById('audio_bg_level');
				//p.style.height = newVolume + 'px';
				//p.style.marginTop = -newVolume + 'px';
			}.bind(this)
		);
		
		//if (this.props.onEnd) localPlayer.addEventListener('ended', this.props.onEnd);
		//if (this.props.onError) localPlayer.addEventListener('error', this.props.onError);
		
		//localPlayer.addEventListener('progress', function(progress) {
			//this.currentMediaTime = this.props.seekTo;
			//if (this.props.onProgress) this.props.onProgress;
		//})
		

		// This object will implement PlayerHandler callbacks with
		// remotePlayerController, and makes necessary UI updates specific
		// to remote playback
		var playerTarget = {targetType:'remote'};

		playerTarget.play = function () {
			if (this.remotePlayer.isPaused) {
				this.remotePlayerController.playOrPause();
			}

			//var vi = document.getElementById('video_image');
			//vi.style.display = 'block';
			//var localPlayer = document.getElementById('video_element');
			//localPlayer.style.display = 'none';
		}.bind(this);

		playerTarget.pause = function () {
			console.log(['REMOTEPLAYER PAUSE'])
			
			if (!this.remotePlayer.isPaused) {
				this.remotePlayerController.playOrPause();
			}
		}.bind(this);

		playerTarget.stop = function () {
			console.log(['REMOTEPLAYER STOP'])
			 this.remotePlayerController.stop();
			 castSession.endSession(true);
		}.bind(this);
		
		playerTarget.disconnect = function () {
			console.log(['REMOTEPLAYER DISCONNECT'])
			 castSession.endSession(true);
		}.bind(this);


		playerTarget.load = function (media,autoPlay) {
			console.log('Loading...' + media.title);
			var mediaInfo = new chrome.cast.media.MediaInfo(media.url, 'video/mp4');

			mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
			mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
			mediaInfo.metadata.title = media.title;
			mediaInfo.metadata.images = [{'url': media.thumbnail}];

			var request = new chrome.cast.media.LoadRequest(mediaInfo);
			castSession.loadMedia(request).then(
				this.playerHandler.loaded.bind(this.playerHandler)(autoPlay),
				function (errorCode) {
					this.playerState = PLAYER_STATE.ERROR;
					console.log('Remote media load error: ' +
						CastPlayer.getErrorMessage(errorCode));
					if (this.props.onError) this.props.onError('Remote media load error: ' +
						CastPlayer.getErrorMessage(errorCode))
				}.bind(this));
		}.bind(this);

		playerTarget.getCurrentMediaTime = function() {
			return this.remotePlayer.currentTime;
		}.bind(this);

		playerTarget.getMediaDuration = function() {
			return this.remotePlayer.duration;
		}.bind(this);

		playerTarget.updateDisplayMessage = function () {
			//document.getElementById('playerstate').style.display = 'block';
			//document.getElementById('playerstatebg').style.display = 'block';
			//document.getElementById('video_image_overlay').style.display = 'block';
			//document.getElementById('playerstate').innerHTML =
				//this.mediaContents[ this.currentMediaIndex]['title'] + ' ' +
				//this.playerState + ' on ' + castSession.getCastDevice().friendlyName;
		}.bind(this);

		playerTarget.setVolume = function (volumeSliderPosition) {
			// Add resistance to avoid loud volume
			var currentVolume = this.remotePlayer.volumeLevel;
		  //  var p = document.getElementById('audio_bg_level');
			if (volumeSliderPosition < FULL_VOLUME_HEIGHT) {
				//var vScale =  this.currentVolume * FULL_VOLUME_HEIGHT;
				//if (volumeSliderPosition > vScale) {
					//volumeSliderPosition = vScale + (pos - vScale) / 2;
				//}
				//p.style.height = volumeSliderPosition + 'px';
				//p.style.marginTop = -volumeSliderPosition + 'px';
				currentVolume = volumeSliderPosition / FULL_VOLUME_HEIGHT;
			} else {
				currentVolume = 1;
			}
			this.remotePlayer.volumeLevel = currentVolume;
			this.remotePlayerController.setVolumeLevel(currentVolume);
		}.bind(this);

		playerTarget.mute = function () {
			if (!this.remotePlayer.isMuted) {
				this.remotePlayerController.muteOrUnmute();
			}
		}.bind(this);

		playerTarget.unMute = function () {
			if (this.remotePlayer.isMuted) {
				this.remotePlayerController.muteOrUnmute();
			}
		}.bind(this);

		playerTarget.isMuted = function() {
			return this.remotePlayer.isMuted;
		}.bind(this);

		playerTarget.seekTo = function (time) {
			console.log(['REMOATE SEEK',time]);
			this.remotePlayer.currentTime = time;
			this.remotePlayerController.seek();
		}.bind(this);

		this.playerHandler.setTarget(playerTarget);

		// Setup remote player volume right on setup
		// The remote player may have had a volume set from previous playback
		if (this.remotePlayer.isMuted) {
			this.playerHandler.mute();
		}
		//var currentVolume = this.remotePlayer.volumeLevel * FULL_VOLUME_HEIGHT;
		
		//var p = document.getElementById('audio_bg_level');
		//p.style.height = currentVolume + 'px';
		//p.style.marginTop = -currentVolume + 'px';

		//this.hideFullscreenButton();

		//if (this.props.isPlaying) {
			//this.playerHandler.play();
		//}
		console.log(['REMOTE NOW LOAD',this.props.media])
		this.playerHandler.load(this.props.media,autoPlay);
	};

	/**
	 * Starts the timer to increment the media progress bar
	 */
	startProgressTimer = function() {
		this.stopProgressTimer();
		console.log('start timer');
		
		// Start progress timer
		this.timer = setInterval(this.incrementMediaTime, 1000);
	};

	/**
	 * Stops the timer to increment the media progress bar
	 */
	stopProgressTimer = function() {
		console.log('stop timer');
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	};

	/**
	 * Helper function
	 * Increment media current position by 1 second
	 */
	incrementMediaTime = function() {
		//console.log(['increment media time'])
		// First sync with the current player's time
		this.currentMediaTime = this.playerHandler.getCurrentMediaTime();
		this.currentMediaDuration = this.playerHandler.getMediaDuration();

		if (this.playerState === PLAYER_STATE.PLAYING) {
		//console.log(['increment media time is playing',this.currentMediaTime,this.currentMediaDuration])
			if (this.currentMediaTime < this.currentMediaDuration) {
				this.currentMediaTime += 1;
			//	console.log(['increment media time set progress',this.props.onProgress])
				if (this.props.onProgress) this.props.onProgress(this.currentMediaTime)
			} else {
				this.endPlayback();
			}
		}
	};

	/**
	 *  End playback. Called when media ends.
	 */
	endPlayback = function() {
		this.currentMediaTime = 0;
		this.stopProgressTimer();
		this.playerState = PLAYER_STATE.IDLE;
		if (this.props.onEnd) this.props.onEnd()
	};


	
    render() {
		 
        let currentUrl=null;
        let currentTrack=this.props.media;
        if (currentTrack && currentTrack.url) {
			if (currentTrack.url.startsWith('http://') || currentTrack.url.startsWith('https://')) {
				currentUrl = currentTrack.url
			} else {
				currentUrl = this.props.apiUrl + currentTrack.url ;
			}
        } 
        let trackType='audio';
        if (currentTrack && currentTrack.type) {
            trackType = currentTrack.type;
        } 
        //if (currentTrack && currentTrack.url && (currentTrack.url.indexOf('youtube.com') !== -1 || currentTrack.url.indexOf('youtu.be') !== -1)) {
			//trackType = 'youtube'
		//}
        //if (currentTrack && currentTrack.url && (currentTrack.url.indexOf('vimeo.com') !== -1 || currentTrack.url.indexOf('youtu.be') !== -1)) {
			//trackType = 'vimeo'
		//}
		
        // height, width, 
        // visibility - if video or youtube or vimeo
        let wrapperStyle={position: 'fixed',top:0,left:0,bottom:0,right:0,width: '100%',height: '100%',backgroundColor:'black',zIndex: 99}
		
		let extraParams={};
        if (this.props.isPlaying) extraParams={autoplay:'autoplay'}
        let playerStyle={height:'100%',width:'100%'};

		let hideCastButton = this.playerHandler.targetType === 'remote' ? true :false
        let castButtonStyle = {position: 'fixed',top:0,right:0, width: '40px',height: '40px',zIndex: 100}
        //{hideCastButton && <button className='btn ' style={castButtonStyle} onClick={() => {this.playerHandler.stop()}} ><img src={chromecastIcon} /></button>}
				
        //!this.props.hideFooter && this.props.showingPlayControls &&
        //if (!this.props.isPlaying) {
			//playerStyle.display = 'none'
		//}
		//{<google-cast-launcher id="castbutton" style={castButtonStyle}></google-cast-launcher>}
			console.log(this.props.media);	
			let type = this.props.media.type === 'audio' ? 'audio' : 'video'
        return  <div style={wrapperStyle} >
				
				<div style={{opacity:1,zIndex:101}} onClick={this.togglePlayback} >
					{type === "video" && <video  ref={this.mediaRef} src={currentUrl} style={playerStyle} {...extraParams} />}
					{type === "audio" && <audio  ref={this.mediaRef} src={currentUrl} style={playerStyle} {...extraParams} />}
				</div>
			</div>
    };
}
//{true || this.props.media.type === "video" && 
	  
	/**
	 * Makes human-readable message from chrome.cast.Error
	 * @param {chrome.cast.Error} error
	 * @return {string} error message
	 */
	CastPlayer.getErrorMessage = function(error) {
		switch (error.code) {
			case chrome.cast.ErrorCode.API_NOT_INITIALIZED:
				return 'The API is not initialized.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.CANCEL:
				return 'The operation was canceled by the user' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.CHANNEL_ERROR:
				return 'A channel to the receiver is not available.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.EXTENSION_MISSING:
				return 'The Cast extension is not available.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.INVALID_PARAMETER:
				return 'The parameters to the operation were not valid.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE:
				return 'No receiver was compatible with the session request.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.SESSION_ERROR:
				return 'A session could not be created, or a session was invalid.' +
					(error.description ? ' :' + error.description : '');
			case chrome.cast.ErrorCode.TIMEOUT:
				return 'The operation timed out.' +
					(error.description ? ' :' + error.description : '');
		}
	};
  
  


