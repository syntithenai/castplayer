import React, { Component } from 'react'

import CastPlayer from './CastPlayer'
import CastPlayerControls from './CastPlayerControls'


export default class CastPlayerController extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			seekTo:this.props.seekTo ? this.props.seekTo : 0,
			mute:this.props.mute ? this.props.seekTo : false,
			volume: this.props.volume ? this.props.volume : 50,
			currentTrack : this.props.currentTrack ? this.props.currentTrack : 0,
			// follow playback events to maintain isPlaying state
			isPlaying: this.props.isPlaying ? this.props.isPlaying : false
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
		this.onVolume = this.onEnd.bind(this);
		this.onMute = this.onEnd.bind(this);
		
		//this.getCurrentMedia = this.getCurrentMedia.bind(this);
		//this.getCurrentMedia = this.getCurrentMedia.bind(this);
		//this.getCurrentMedia = this.getCurrentMedia.bind(this);
		
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
		let currentTrack = this.state.currentTrack;
		currentTrack = (currentTrack - 1) % this.playlist.length;
		this.setState({seekTo:0,currentTrack:currentTrack})
	}

	nextTrack() {
		let currentTrack = this.state.currentTrack;
		currentTrack = (currentTrack + 1) % this.playlist.length;
		this.setState({seekTo:0,currentTrack:currentTrack})
	}
	

	onPlay() {
		console.log('on play')
		this.setState({isPlaying:true});
	}

	onPause() {
		console.log('on pause')
		this.setState({isPlaying:false});
	}

	onEnd() {
		console.log('on end')
		this.setState({isPlaying:false});
	}

	onError() {
		console.log('on error')
		this.setState({isPlaying:false});
	}
	
	onProgress(progress) {
		//console.log(['on progress',progress])
		// pushing updated progress to state will cause controls to update (progress bar/play pause)
		// CastPlayer will not update because of check in shouldComponentUpdate 
		this.setState({seekTo:progress});
	}
	
	onVolume(volume) {
		this.setState({volume:volume});
	}
	
	onMute(mute) {
		this.setState({mute:mute});
	}
	
	onCast(casting) {
		this.setState({casting:casting});
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
				<CastPlayer ref={this.player} chromecastReceiverApplicationId='4F8B3483'  media={media} isPlaying={this.state.isPlaying} seekTo={this.state.seekTo} mute={this.state.mute} volume={this.state.volume}  onError={this.onError} onPlay={this.onPlay}  onPause={this.onPause}  onProgress={this.onProgress}  onEnd={this.onEnd} onCast={this.onCast} />
				
				<CastPlayerControls casting={this.state.casting} nextTrack={this.nextTrack} previousTrack={this.previousTrack} isPlaying={this.state.isPlaying} player={this.player} media={media} seekTo={this.state.seekTo} mute={this.state.mute} volume={this.state.volume} onError={this.onError} onPlay={this.onPlay}  onPause={this.onPause}  onProgress={this.onProgress}  onEnd={this.onEnd}  />
			 </div>
		} else {
			return <b>No Media</b>;
		}
	}

}
