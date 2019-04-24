import React, { Component } from 'react'

import samplePlaylist from './sample_playlist'

import {CastPlayerController} from 'castplayer'
import {FaList as ListButton} from 'react-icons/fa';
import {FaHeart as LikeButton} from 'react-icons/fa';

//import LikeButton from './LikeButton'


export default class App extends Component {
	render() {
		let extraButtons = { 
			left:[{label:<LikeButton size='33' />,onClick:function() {console.log('FAV CLICK')}}],
			right:[{label:<ListButton size='33' />,onClick:function() {console.log('PLAYLIST CLICK')}}]
		}
		return <CastPlayerController chromecastReceiverApplicationId='4F8B3483' playlist={samplePlaylist} extraButtons={extraButtons}></CastPlayerController>
	}

}
