/* global window */
/* global cast */
/* global chrome */


import React, { Component } from 'react';

import {FaForward as NextButton} from 'react-icons/fa';
import {FaBackward as PreviousButton} from 'react-icons/fa';
import {FaPlay as PlayButton} from 'react-icons/fa';
import {FaPause as PauseButton} from 'react-icons/fa';
import {FaList as ListButton} from 'react-icons/fa';

import chromecastIcon from './chromecast.svg'


export default  class CastPlayerControls extends Component {
	
	
	constructor(props) {
		super(props)
		this.state = {
			showExtendedControls: false,
			
		}
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.clickProgress = this.clickProgress.bind(this);
		this.togglePlayback = this.togglePlayback.bind(this);
	}
	
	componentDidMount() {
		console.log(['CAST PLAYER controls mount ',this.props])

	}
	
	play() {
		console.log('PLAY');
		console.log(this.props.player)
		if (this.props.player.current) {
			this.props.player.current.playerHandler.play()
		}
	}

	pause() {
		console.log('PAUSE');
		if (this.props.player.current) {
			this.props.player.current.playerHandler.pause()
		}
	}
	
	togglePlayback= function() {
		if (this.props.isPlaying) {
			this.pause()
		} else {
			this.play()
		}
	}
	
	clickProgress = function(e) {
		 if (this.props.media) {
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
	/**
	 * @param {number} durationInSec
	 * @return {string}
	 */
	getDurationString = function(durationInSec) {
	   
	    //if (isNaN(parseFloat(sec_num,10))) return '';
		var sec_num = parseInt(durationInSec, 10); // don't forget the second param
		console.log(['getDurationString',durationInSec])
		var hours   = Math.floor(sec_num / 3600);
		var hoursClean = hours;
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		if (minutes === NaN || seconds === NaN) {
			return '';
		}
		if (hours   < 10) {hours   = "0"+parseInt(hours,10);}
		if (minutes < 10) {minutes = "0"+parseInt(minutes,10);}
		if (seconds < 10) {seconds = "0"+parseInt(seconds,10);}
		
		
		if (hoursClean > 0) {
			return hours+':'+minutes+':'+seconds;
		} else {
			return minutes+':'+seconds;
		}
	};
     
	
	showAllControls= function(e) {
		if (this.state.extendedControls) {
			this.setState({extendedControls:false});
		} else {
			this.setState({extendedControls:true});
		}
	}

	render() {
		
//		if (this.props.
		let currentTrack = this.props.media;
		let isPlaying = this.props.isPlaying;
		//this.props.player.current && this.props.player.current.playerHandler ? this.props.player.current.playerHandler.isPlaying() : false;
            let buttonSize=33;
            let playBoost=15;
            let progressPercent='0%';
			let castButtonStyle = {position: 'fixed',top:0,right:0, width: '40px',height: '40px',zIndex: 100}
			let hideCastButton = this.props.casting ? true  : false; //this.playerHandler.targetType === 'remote' ? true :false
//player.current.playerHandler.getCurrentMediaTime()        
            let mediaTime = this.getDurationString(this.props.seekTo);
            let mediaDuration = this.props.player.current && this.props.player.current.playerHandler ? this.getDurationString(this.props.player.current.playerHandler.getMediaDuration()) : ''
            if (this.props.player.current && this.props.player.current.playerHandler) progressPercent=parseInt(this.props.player.current.playerHandler.getCurrentMediaTime()/this.props.player.current.playerHandler.getMediaDuration()*10000,10)/100+'%';
            //console.log(progressPercent);
            return <div>
      {!hideCastButton && <google-cast-launcher id="castbutton" style={castButtonStyle}></google-cast-launcher>}
		{hideCastButton && <span style={castButtonStyle} onClick={() => {this.props.player.current.playerHandler.disconnect()}} ><img src={chromecastIcon} style={{color:'blue',height:'40px'}} /></span>}
				<div className="playcontrols" style={{zIndex:'999',position: 'fixed', bottom: '0', width:'100%', backgroundColor:'black', height: '7em',padding: '0.05em', border:'1px solid black'}}>
				  <div className='progressbar' onClick={(e) => this.clickProgress(e)} style={{height: '0.8em',width:'100%', backgroundColor:'lightgrey', marginBottom: '0.2em',opacity:'0.8'}} >
					<div className='progressbarinner' style={{height: '0.8em',width:progressPercent, backgroundColor:'green',opacity:'0.8'}} >&nbsp;</div>
				  </div>
				  <span  className='progresstime' style={{position:'absolute',right: 20, top: 16, color: 'white'}} >{mediaTime}/{mediaDuration}</span>
				  <div className='titlebar' onClick={(e) => this.clickProgress(e)} style={{height: '0.8em',width:'100%', backgroundColor:'black',color:'white', marginBottom: '1.2em'}} >{currentTrack ? currentTrack.artist+'- ' : ''} {currentTrack ? currentTrack.title : ''}  {this.props.isPlaying ? 'PLAYING' : 'STOPPED'}
				  
				  {this.props.casting ? 'REMOTE' : 'LOCAL'}
				  {this.props.seekTo}
</div>
				 
				  <div className='castplayer-controls' style={{paddingBottom: '0.2em'}} >
					  {this.state.extendedControls && <b>extrabuttons</b>}
					  {this.props.previousTrack && <button className='btn' style={{marginLeft:'0.7em', marginTop:'0.8em'}} ><PreviousButton onClick={this.props.previousTrack} size={buttonSize} /></button>}
					  <button  className='btn'  onClick={this.togglePlayback} style={{marginLeft:'0.7em',marginRight:'0.7em'}} >
						{!isPlaying && <PlayButton size={buttonSize+playBoost}/>}
						{isPlaying && <PauseButton size={buttonSize+playBoost}/>}
					  </button>
					  {this.props.nextTrack && <button  className='btn'style={{ marginTop:'0.8em'}} ><NextButton  onClick={this.props.nextTrack} size={buttonSize}/></button>}
				   
					  <button onClick={this.showAllControls} className='btn'  style={{float:'right', marginTop:'0.8em'}} ><ListButton  size={buttonSize}/></button>
				  </div>
				</div>
			</div>
    }
}
