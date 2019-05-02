import PLAYER_STATE from './playerStateConstants';

/**
 * PlayerHandler
 *
 * This is a handler through which the application will interact
 * with both the RemotePlayer and LocalPlayer. Combining these two into
 * one interface is one approach to the dual-player nature of a Cast
 * Chrome application. Otherwise, the state of the RemotePlayer can be
 * queried at any time to decide whether to interact with the local
 * or remote players.
 *
 * To set the player used, implement the following methods for a target object
 * and call setTarget(target).
 *
 * Methods to implement:
 *  - play()
 *  - pause()
 *  - stop()
 *  - seekTo(time)
 *  - load(mediaIndex)
 *  - getMediaDuration()
 *  - getCurrentMediaTime()
 *  - setVolume(volumeSliderPosition)
 *  - mute()
 *  - unMute()
 *  - isMuted()
 *  - updateDisplayMessage()
 */
export default function(castPlayer) {
	this.target = {};
	//console.log(['NEW PLAYER HANDLER'])
    this.setTarget= function(target) {
	//		console.log(['NEW PLAYER HANDLER SET TARGET',target])
        this.target = target;
    };
	
	//this.isPlaying= function() {
		//if (castPlayer.playerState === PLAYER_STATE.PLAYING) {
			//return true;
		//} else {
			//return false;
		//}
	//};

    this.play = function() {
        console.log(['PLAYER HANDLER  PLAY ',castPlayer.playerState])
		// if new media, load it
		if (castPlayer.playerState !== PLAYER_STATE.PLAYING &&
            castPlayer.playerState !== PLAYER_STATE.PAUSED &&
            castPlayer.playerState !== PLAYER_STATE.LOADED) {
				console.log(['PLAYER HANDLER PLAY load file ',castPlayer.props.media])
				//castPlayer.playerState = PLAYER_STATE.PLAYING;
				this.load(castPlayer.props.media);
		} else {
			console.log(['PLAYER HANDLER PLAY already loaded file  ',castPlayer.props.media])
				
			this.target.play();
			castPlayer.playerState = PLAYER_STATE.PLAYING;
			if (castPlayer.props.onPlay) castPlayer.props.onPlay()
		}
    };

    this.pause = function() {
		console.log(['PLAYER HANDLER PAUSE ',castPlayer.playerState])
		
        if (castPlayer.playerState !== PLAYER_STATE.PLAYING) {
            return;
        }

        this.target.pause();
        castPlayer.playerState = PLAYER_STATE.PAUSED;
        if (castPlayer.props.onPause) castPlayer.props.onPause()
        //document.getElementById('play').style.display = 'block';
        //document.getElementById('pause').style.display = 'none';
        //this.updateDisplayMessage();
    };

    this.stop = function() {
		console.log(['PLAYER HANDLER STOP '])
		
        this.target.stop();
        castPlayer.playerState = PLAYER_STATE.STOPPED;
        if (castPlayer.props.onPause) castPlayer.props.onPause()
        //this.updateDisplayMessage();
    };
    
    this.disconnect = function() {
		if (this.target.disconnect) this.target.disconnect();
	}

    this.load = function(media,autoPlay) {
		console.log(['PLAYER HANDLER load ',media])
		castPlayer.playerState = PLAYER_STATE.LOADING;
		//if (castPlayer.props.onPause) castPlayer.props.onPause()
        
        //document.getElementById('media_title').innerHTML =
            //castPlayer.mediaContents[castPlayer.currentMediaIndex]['title'];
        //document.getElementById('media_subtitle').innerHTML =
            //castPlayer.mediaContents[castPlayer.currentMediaIndex]['subtitle'];
        //document.getElementById('media_desc').innerHTML =
            //castPlayer.mediaContents[castPlayer.currentMediaIndex]['description'];

        this.target.load(media,autoPlay);
       // this.updateDisplayMessage();
    };

    this.loaded = function(autoPlay) {
		let that = this;
		console.log(['PLAYER HANDLER loaded',castPlayer.props])
		//let oldState = castPlayer.playerState;
        castPlayer.currentMediaDuration = this.getMediaDuration();
        //  castPlayer.updateMediaDuration();
        castPlayer.playerState = PLAYER_STATE.LOADED;
        //autoPlay) { //
        if (!autoPlay) {
		    console.log(['PLAYER HANDLER no start playing'])
            //this.play();
			//setTimeout(function() {
				that.pause();
			//},50);
		} else {
		    console.log(['PLAYER HANDLER start playing'])
        	this.play();
		}
		 if (castPlayer.props.seekTo > 0) {
            console.log(['PLAYER HANDLER loaded seek to',castPlayer.props.seekTo])
       //     setTimeout(function() {
				that.seekTo(castPlayer.props.seekTo);
        //	},500);
		}
       
		castPlayer.startProgressTimer();
		//  this.updateDisplayMessage();
    };

    this.getCurrentMediaTime = function() {
        return this.target.getCurrentMediaTime();
    };

    this.getMediaDuration = function() {
        return this.target.getMediaDuration();
    };

   
    this.setVolume = function(volumeSliderPosition) {
		console.log(['PLAYER HANDLER SET VOLUME',volumeSliderPosition,castPlayer.props.onVolume])
        this.target.setVolume(volumeSliderPosition);
		if (castPlayer.props.onVolume) castPlayer.props.onVolume(volumeSliderPosition)
    };

    this.mute = function() {
        console.log(['PLAYER HANDLER MUTE'])
        this.target.mute();
        if (castPlayer.props.onMute) castPlayer.props.onMute(true)
    };

    this.unMute = function() {
        console.log(['PLAYER HANDLER UNMUTE'])
        this.target.unMute();
        if (castPlayer.props.onMute) castPlayer.props.onMute(false)
    };

    this.isMuted = function() {
        return this.target.isMuted();
    };

    this.seekTo = function(time) {
         console.log(['PLAYER HANDLER seek',time])
         this.target.seekTo(time);
         castPlayer.currentMediaTime = time;
         //if (castPlayer.props.onProgress) castPlayer.props.onProgress(time)        
        //this.updateDisplayMessage();
    };
};
