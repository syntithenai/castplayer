
import React, { Component } from 'react';

import {FaForward as NextButton} from 'react-icons/fa';
import {FaBackward as PreviousButton} from 'react-icons/fa';
import {FaPlay as PlayButton} from 'react-icons/fa';
import {FaPause as PauseButton} from 'react-icons/fa';
import {FaList as ListButton} from 'react-icons/fa';
import {FaVolumeMute as MuteButton} from 'react-icons/fa';
import {FaVolumeUp as VolumeButton} from 'react-icons/fa';
import {FaRedo as RepeatButton} from 'react-icons/fa';
import {FaRandom as ShuffleButton} from 'react-icons/fa';



//import chromecastIcon from './chromecast.svg'
//import chromecastOffIcon from './chromecast-off.svg'


export default  class CastPlayerControls extends Component {
	
	
	constructor(props) {
		super(props)
		this.state = {
			showExtendedControls: true,
		}
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.clickProgress = this.clickProgress.bind(this);
		this.clickVolume = this.clickVolume.bind(this);
		//this.clickMute = this.clickMute.bind(this);
		this.togglePlayback = this.togglePlayback.bind(this);
		//this.showAllControls = this.showAllControls.bind(this)
		this.unMute = this.unMute.bind(this)
		this.mute = this.mute.bind(this)
		//this.repeat = this.repeat.bind(this)
		//this.shuffle = this.shuffle.bind(this)
	}
	
	componentDidMount() {
	//	console.log(['CAST PLAYER controls mount ',this.props])
	}
	
	play() {
		console.log('controls PLAY');
		//console.log(this.props.player)
		if (this.props.player.current) {
			this.props.player.current.playerHandler.play()
		}
	}

	pause() {
		console.log('controls PAUSE');
		if (this.props.player.current) {
			this.props.player.current.playerHandler.pause()
		}
	}
	
	togglePlayback= function() {
		console.log('controls toggle');
		if (this.props.isPlaying) {
			this.pause()
		} else {
			this.play()
		}
	}
	
	clickProgress = function(e) {
		 if (this.props.media && this.props.player.current && this.props.player.current.playerHandler) {
			 // width based on parent progress bar so determine which one was clicked
			 let width = e.target.offsetWidth;
			 if (e.target.className === 'progressbarinner') {
				 width = e.target.parentNode.offsetWidth;
			 }
            let percentage = (e.pageX - e.target.offsetLeft)/ width;
            let newPos = percentage * this.props.player.current.playerHandler.getMediaDuration();
            if (newPos != NaN) {
				this.props.player.current.playerHandler.seekTo(newPos);
			}
        }
	}
	
	clickVolume = function(e) {
		console.log(['CLICK VOLUME'])
		//if (this.props.media) {
			 // width based on parent progress bar so determine which one was clicked
			 let width = e.target.offsetWidth;
			 if (e.target.className === 'volumebarinner') {
				 width = e.target.parentNode.offsetWidth;
			 }
            let percentage = (e.pageX - e.target.offsetLeft)/ width;
			console.log(['CLICK VOLUME',percentage])
            let newPos = percentage * 100;
            if (newPos !== NaN) {
				this.props.player.current.playerHandler.setVolume(newPos);
			}
        //}
	}
	
	unMute = function(val) {
		this.props.player.current.playerHandler.unMute();
	}
	
	
	mute = function(val) {
		this.props.player.current.playerHandler.mute();
	}
	
	
	
	//repeat = function(val) {
		//this.props.onRepeat(val);
		////this.setState({repeat:!this.state.repeat});
	//}
	
	//shuffle = function(val) {
		//this.props.onShuffle(val);
		////this.setState({shuffle:!this.state.shuffle});
	//}
	
	
	/**
	 * @param {number} durationInSec
	 * @return {string}
	 */
	getDurationString = function(durationInSec) {
	   
	    //if (isNaN(parseFloat(sec_num,10))) return '';
		var sec_num = parseInt(durationInSec, 10); // don't forget the second param
		//console.log(['getDurationString',durationInSec])
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		if (isNaN(minutes) || isNaN(seconds)) {
			return '';
		}
		
		if (hours   < 10) {hours   = "0"+parseInt(hours,10);}
		if (minutes < 10) {minutes = "0"+parseInt(minutes,10);}
		if (seconds < 10) {seconds = "0"+parseInt(seconds,10);}
		
		
		if (hours > 0) {
			return hours+':'+minutes+':'+seconds;
		} else {
			return minutes+':'+seconds;
		}
	};
     
	
	//showAllControls= function(e) {
		//if (this.state.extendedControls) {
			//this.setState({showExtendedControls:false});
		//} else {
			//this.setState({showExtendedControls:true});
		//}
	//}

	render() {
		
//		if (this.props.
		let currentTrack = this.props.media;
		let isPlaying = this.props.isPlaying;
		//this.props.player.current && this.props.player.current.playerHandler ? this.props.player.current.playerHandler.isPlaying() : false;
		let leftButtons = this.props.extraButtons.left.map(function(button) {
			return <button key={button} className='btn' onClick={button.onClick} size='33'  >{button.label}</button>
		});
		let rightButtons = this.props.extraButtons.right.map(function(button) {
			return <button key={button} className='btn'  onClick={button.onClick} size='33' >{button.label}</button>
		});
		 let controlBlockHeight = this.state.showExtendedControls ? '9em' : '7em';
		 
            let buttonSize=33;
            let playBoost=15;
            let castButtonStyle = {position: 'fixed',top:0,right:0, width: '40px',height: '40px',zIndex: 1000}
			let hideCastButton = this.props.casting === true ? true  : false; //this.playerHandler.targetType === 'remote' ? true :false
//player.current.playerHandler.getCurrentMediaTime()        
            let mediaTime = this.getDurationString(this.props.seekTo);
            let mediaDuration = this.props.player.current && this.props.player.current.playerHandler ? this.getDurationString(this.props.player.current.playerHandler.getMediaDuration()) : ''
            
            let progressPercent='0%';
			if (this.props.player.current && this.props.player.current.playerHandler) progressPercent=parseInt(this.props.player.current.playerHandler.getCurrentMediaTime()/this.props.player.current.playerHandler.getMediaDuration()*10000,10)/100+'%';
            
            let volumePercent='0%';
			if (this.props.player.current && this.props.player.current.playerHandler) volumePercent=this.props.volume+'%';
            
            //console.log(progressPercent);
        //{!hideCastButton && <google-cast-launcher id="castbutton" style={castButtonStyle}></google-cast-launcher>}
		//{hideCastButton && <span style={castButtonStyle} onClick={() => {this.props.player.current.playerHandler.disconnect()}} ><img src={chromecastIcon} style={{color:'blue',height:'40px'}} /></span>}
		 //{!hideCastButton && <span style={castButtonStyle} onClick={() => {this.props.startCast()}} ><img src={chromecastOffIcon} style={{height:'40px'}} /></span>}
		//{hideCastButton && <span style={castButtonStyle} onClick={() => {this.props.stopCast()}} ><img src={chromecastIcon} style={{height:'40px'}} /></span>}
		    return <div>
				<div style={castButtonStyle} ><google-cast-launcher ></google-cast-launcher></div>
       
				<div className="playcontrols" style={{zIndex:'999',position: 'fixed', bottom: '0', width:'100%', backgroundColor:'black', height: controlBlockHeight,padding: '0.05em', border:'1px solid black'}}>
				  <div className='progressbar' onClick={(e) => this.clickProgress(e)} style={{height: '0.8em',width:'100%', backgroundColor:'lightgrey', marginBottom: '0.2em',opacity:'0.8'}} >
					<div className='progressbarinner' style={{height: '0.8em',width:progressPercent, backgroundColor:'green',opacity:'0.8'}} >&nbsp;</div>
				  </div>
				  <span  className='progresstime' style={{zIndex:'150', backgroundColor:'black',position:'absolute',right: 20, top: 16, color: 'white'}} >{mediaTime}/{mediaDuration}</span>
				  <div className='titlebar' onClick={(e) => this.clickProgress(e)} style={{marginLeft:'0.5em',height: '0.8em',width:'100%', backgroundColor:'black',color:'white', marginBottom: '0.6em'}} >{currentTrack ? currentTrack.artist+'- ' : ''} {currentTrack ? currentTrack.title : ''}  
</div>
				 
				  <div className='castplayer-controls' style={{paddingBottom: '0.2em'}} >
					  {this.state.showExtendedControls && <div style={{clear:'both'}}>
						   <button  style={{float:'left',marginRight:'0.2em',color:(this.props.repeat ? 'blue': 'black')}} className='btn btn-inline'  onClick={(e) => this.props.onRepeat(!this.props.repeat)} ><RepeatButton/></button> 
						  <button  style={{float:'left',marginRight:'0.2em',color:(this.props.shuffle ? 'blue': 'black')}} className='btn btn-inline'  onClick={(e) => this.props.onShuffle(!this.props.shuffle)} ><ShuffleButton/></button>
						  
						  {!this.props.mute && <button  style={{float:'left'}} className='btn btn-inline'  onClick={this.mute} ><VolumeButton/></button> }
						  {this.props.mute && <button  style={{float:'left'}}  className='btn btn-inline'  onClick={this.unMute} ><MuteButton/></button> }
						  <div className='volumebar' onClick={(e) => this.clickVolume(e)} style={{height: '1em',width:'50%', backgroundColor:'lightgrey', marginBottom: '0.2em',opacity:'0.8', float:'left'}} >
						<div className='volumebarinner' style={{height: '1em',width:volumePercent, backgroundColor:'blue',opacity:'0.8'}} >&nbsp;</div>
					  </div>
					  
						  </div>}
					  
					
					  <span  className='progresstime' style={{position:'absolute',right: 20, top: 16, color: 'white'}} >{mediaTime}/{mediaDuration} </span>
					  <br/>
					  <div style={{clear:'both',textAlign:'center'}}>
					  {this.props.previousTrack && <button className='btn' style={{marginLeft:'0.7em', marginTop:'0.8em'}} ><PreviousButton onClick={this.props.previousTrack} size={buttonSize} /></button>}
					  <button  className='btn'  onClick={this.togglePlayback} style={{marginLeft:'0.7em',marginRight:'0.7em'}} >
						{!isPlaying && <PlayButton size={buttonSize+playBoost}/>}
						{isPlaying && <PauseButton size={buttonSize+playBoost}/>}
					  </button>
					  {this.props.nextTrack && <button  className='btn'style={{ marginTop:'0.8em'}} ><NextButton  onClick={this.props.nextTrack} size={buttonSize}/></button>}
					<div style={{float:'left',marginTop:'1em'}} >{leftButtons}</div>
					  
					  <div style={{float:'right',marginTop:'1em'}} >{rightButtons}</div>
					  </div>
				  </div>
				</div>
			</div>
    }
}
//<button onClick={this.showAllControls} className='btn'  style={{float:'right', marginTop:'0.8em'}} ><ListButton  size={buttonSize}/></button>
					  
