/* global window */
import React, { Component } from 'react'

import CastPlayerComponent from './CastPlayerComponent'
import CastPlayerControls from './CastPlayerControls'

import md5 from 'md5'

export default class CastPlayerController extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			seekTo:this.props.seekTo ? this.props.seekTo : 0,
			mute:this.props.mute ? this.props.seekTo : false,
			volume: this.props.volume ? this.props.volume : 50,
			currentTrack : this.props.currentTrack ? this.props.currentTrack : 0,
			// follow playback events to maintain isPlaying state
			isPlaying: this.props.isPlaying ? this.props.isPlaying : false,
			shuffle: false,
			repeat: false,
			hideControls: false,
			errorCount: 0
		}
		this.player = React.createRef();
		
		this.getCurrentMedia = this.getCurrentMedia.bind(this);
		this.previousTrack = this.previousTrack.bind(this);
		this.nextTrack = this.nextTrack.bind(this);
		
		this.onError = this.onError.bind(this);
		this.onPlay = this.onPlay.bind(this);
		this.onPause = this.onPause.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.onCast = this.onCast.bind(this);
		
		this.onProgress = this.onProgress.bind(this);
		this.onVolume = this.onVolume.bind(this);
		this.onMute = this.onMute.bind(this);
		this.onShuffle = this.onShuffle.bind(this);
		this.onRepeat = this.onRepeat.bind(this);
		this.showControls = this.showControls.bind(this);
		this.startCast = this.startCast.bind(this)
		this.stopCast = this.stopCast.bind(this)
		
		this.mediaKey = null;
		this.hideControlsTimeout = null;
		window.addEventListener("mousemove", this.showControls);
	}
	
	componentDidMount() {
		// temp disable
			this.mediaKey = md5(this.getCurrentMedia());
			let progress = localStorage.getItem('progress_'+this.mediaKey);
			let playing = localStorage.getItem('isPlaying');
			let volume = localStorage.getItem('volume');
			let mute = localStorage.getItem('mute');
			let currentTrack = localStorage.getItem('currentTrack');
			let newState = {}
			newState.seekTo = (progress != null ? progress : 0)
			newState.currentTrack = (currentTrack != null ? currentTrack : 0)
			newState.isPlaying = ((playing ==='1') ? true : false)
			newState.volume = (volume ? volume : 50)
			newState.mute = ((mute ==='1') ? true : false)
			//if (newState.mute) this.player.playerHandler.mute();
			console.log(['CONTROLLER MOUNT SET PROGRESS ',this.mediaKey,newState])
			this.setState(newState);
		
	}

	componentDidUpdate(props) {
		if (props.media !== this.props.media) {
			this.mediaKey = md5(this.getCurrentMedia());
			// TODO RESTORE THIS - LOAD FROM LOCALSTORAGE ON PAGE RELOAD. ...
			//let progress = localStorage.getItem('progress_'+this.mediaKey);
			//let playing = localStorage.getItem('isPlaying');
			//let volume = localStorage.getItem('volume');
			//let mute = localStorage.getItem('mute');
			//let currentTrack = localStorage.getItem('currentTrack');
			//let newState = {}
			//newState.seekTo = (progress != null ? progress : 0)
			//newState.isPlaying = ((playing ==='1') ? true : false)
			//newState.volume = (volume ? volume : 50)
			//newState.mute = ((mute ==='1') ? true : false)
			//newState.currentTrack = (currentTrack != null ? currentTrack : 0)
			//if (newState.mute) this.player.playerHandler.mute();
			//console.log(['CONTROLLER UPDATE SET PROGRESS ',this.mediaKey,newState])
			//this.setState(newState);
		}
	}

	getCurrentMedia() {
		if (this.state.currentTrack !== NaN && this.state.currentTrack < this.props.playlist.length) {
			return this.props.playlist[this.state.currentTrack]
		} else {
			return null;
			//throw new Exception('playlist does not contain currentTrack '+this.state.currentTrack);
		}
	}
	
	previousTrack() {
		this.clearErrors()
		let currentTrack = this.state.currentTrack;
		// TODO IMPLEMENT REPEAT SINGLE
		//if (this.state.repeat) {
			//this.setState({seekTo:0});
			//this.player.playerHandler.load(true,true)
		//} else 
		if (this.state.shuffle) {
			let newTrack = (currentTrack +Math.floor(Math.random() * (this.props.playlist.length + 1)))%(this.props.playlist.length )
			//console.log(['PREV SHUFFLE',newTrack])
			localStorage.setItem('currentTrack',newTrack);
			this.setState({seekTo:0,currentTrack:newTrack})
		} else {
			currentTrack = (currentTrack - 1) % this.props.playlist.length;
			localStorage.setItem('currentTrack',currentTrack);
			//console.log(['PREV track',currentTrack])
			this.setState({seekTo:0,currentTrack:currentTrack})
		}
	}

	nextTrack() {
		this.clearErrors()
		let currentTrack = this.state.currentTrack;
		// TODO IMPLEMENT REPEAT SINGLE
		//if (this.state.repeat) {
			//this.setState({seekTo:0});
			//this.player.playerHandler.load(true,true)
		//} else 
		if (this.state.shuffle) {
			let newTrack = (currentTrack +Math.floor(Math.random() * (this.props.playlist.length + 1)))%(this.props.playlist.length )
			//console.log(['NEXT SHUFFLE',newTrack])
			localStorage.setItem('currentTrack',newTrack);
			this.setState({seekTo:0,currentTrack:newTrack})
		} else {
			currentTrack = (currentTrack + 1) % this.props.playlist.length;
			//console.log(['NEXT track',currentTrack])
			localStorage.setItem('currentTrack',currentTrack);
			this.setState({seekTo:0,currentTrack:currentTrack})
		}
	}
	

	onPlay() {
		let that = this;
		this.clearErrors()
		console.log('controller on play')
		this.setState({hideControls:false,isPlaying:true});
		localStorage.setItem('isPlaying','1');
	}
	
	

	showControls() {
		this.setState({hideControls:false});
	}

	onPause() {
		this.clearErrors()
		console.log('controller on pause')
		this.setState({hideControls:false,isPlaying:false});
		if (this.hideControlsTimeout) clearTimeout(this.hideControlsTimeout);
		this.hideControlsTimeout = null;
		localStorage.setItem('isPlaying','0');
	}

	onEnd() {
		this.clearErrors()
		console.log('controller on end')
		this.setState({hideControls:false,isPlaying:false}); //,seekTo:0
		clearTimeout(this.hideControlsTimeout);
		this.hideControlsTimeout = null;
		localStorage.setItem('isPlaying','0');
	}

	onError() {
		console.log('controller on error')
		
		let that=this;
	   // console.log(['ONERROR',this.state.errorCount]);
	   // this.functions.stopWaiting();
		let failCount = this.state.errorCount;
		if (failCount < 3) {
			this.addError();
			setTimeout(function() {
				if (that.player && that.player.current) that.player.current.play();
				//that.play();
			   // that.functions.saveMeekaToLocalStorage();
			},1000);                    
		} else if (failCount < 100) {
			this.addError();
			if (Math.random() >= 0.4) this.nextTrack();
			setTimeout(function() {
				if (that.player && that.player.current) that.player.current.play();
			},1000);            
		}
	}	
		    
	addError() {
		let errors = this.state.errorCount;
		if (isNaN(errors)) errors = 0;
		this.setState({errorCount:errors+1});
	}
	
	clearErrors() {
		this.setState({errorCount:0});
	}

	
	//this.setState({hideControls:false,isPlaying:false});
	//clearTimeout(this.hideControlsTimeout);
	//this.hideControlsTimeout = null;
	//localStorage.setItem('isPlaying','0');
	//}
	
	onProgress(progress) {
		let that = this;
		let track = this.getCurrentMedia();
		// && this.state.isPlaying && !this.state.hideControls
		//console.log(['PROGRESS',progress,track.type,track,this.state.isPlaying,this.state.hideControls,this.hideControlsTimeout]);
		if (track.type ==='video'  && !that.state.casting && this.hideControlsTimeout === null) {
			//console.log('HIDE CONTROLS timeout')
			clearTimeout(this.hideControlsTimeout);
			this.hideControlsTimeout = setTimeout(function() {
				//console.log('HIDE CONTROLS ')
				if (!that.state.casting) that.setState({hideControls:true})
				that.hideControlsTimeout = null;
			},2400);
		}
		
		//console.log(['on progress',progress])
		// pushing updated progress to state will cause controls to update (progress bar/play pause)
		// CastPlayer will not update because of check in shouldComponentUpdate 
		this.setState({seekTo:progress});
		localStorage.setItem('progress_'+this.mediaKey,progress);
	}
	
	onVolume(volume) {
		console.log(['CONTROLLER SET VOLUME',volume])
		this.setState({volume:volume});
		localStorage.setItem('volume',volume);
	}
	
	onMute(mute) {
		console.log(['CONTROLLER on mute',mute])
		this.setState({mute:mute});
		localStorage.setItem('mute',mute ? '1' : '0');
	}
	
	onCast(casting) {
		this.setState({casting:casting});
	}
	
	onShuffle(shuffle) {
		this.setState({shuffle:shuffle,repeat:false});
	}

	onRepeat(repeat) {
		this.setState({repeat:repeat,shuffle:false});
	}
	
	
	startCast = function() {
		console.log(['START CAST BUTTON'])
		this.player.current.startCast()
   }
	
	stopCast = function() {
		console.log(['STOP CAST BUTTON'])
		this.player.current.stopCast()
	}
	
	
	render() {
        let media = this.getCurrentMedia()
                //let mediaProps = {
			//nextTrack:this.nextTrack,
			//previousTrack:this.previousTrack,
			//chromecastReceiverApplicationId:this.props.chromecastReceiverApplicationId,  
			//media:media,
			//isPlaying:this.state.isPlaying, 
			//seekTo:this.state.seekTo, 
			//mute:this.state.mute,
			//volume:this.state.volume,  
			//onError:this.onError, 
			//onPlay:this.onPlay,
			//onPause:this.onPause,
			//onProgress:this.onProgress,  
			//onEnd:this.onEnd
		//}
			//onEnd:this.onEnd
        //let castButtonStyle = {position: 'fixed',top:0,right:0, width: '40px',height: '40px',zIndex: 100}
        //let hideCastButton = this.playerHandler.targetType === 'remote' ? true :false
        //{!hideCastButton && <google-cast-launcher id="castbutton" style={castButtonStyle}></google-cast-launcher>}
		//{hideCastButton && <button className='btn ' style={castButtonStyle} onClick={() => {this.playerHandler.stop()}} ><img src={chromecastIcon} /></button>}
		
        
        if (media) {
			// ensure that a wrapping component is positioned to support absolute positioning of components.
			let playerStyle = {position:'relative',width:'100%',height:'100%'}
			return <div style={playerStyle} >
			
				<CastPlayerComponent ref={this.player} chromecastReceiverApplicationId={this.props.chromecastReceiverApplicationId}  media={media} isPlaying={this.state.isPlaying} seekTo={this.state.seekTo} mute={this.state.mute} volume={this.state.volume}  onError={this.onError} onPlay={this.onPlay}  onPause={this.onPause}  onProgress={this.onProgress}  onEnd={this.onEnd} onCast={this.onCast} onVolume={this.onVolume} onMute={this.onMute} casting={this.state.casting}  />
				
				{!this.state.hideControls && <CastPlayerControls casting={this.state.casting} nextTrack={this.nextTrack} previousTrack={this.previousTrack} isPlaying={this.state.isPlaying} player={this.player} media={media} seekTo={this.state.seekTo} mute={this.state.mute} volume={this.state.volume} onError={this.onError} onPlay={this.onPlay}  onPause={this.onPause}  onProgress={this.onProgress}  onEnd={this.onEnd}  onVolume={this.onVolume} onMute={this.onMute} onShuffle={this.onShuffle}   onRepeat={this.onRepeat} shuffle={this.state.shuffle} repeat={this.state.repeat}  extraButtons={this.props.extraButtons}  startCast={this.startCast} stopCast={this.stopCast} />}
			 </div>
		} else {
			return <b>No Media</b>;
		}
	}

}
