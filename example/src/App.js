import React, { Component } from 'react'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import PropsRoute from './PropsRoute'

import samplePlaylist from './sample_playlist'

import {CastPlayerController,CastReceiver} from 'castplayer'
import {FaList as ListButton} from 'react-icons/fa';
import {FaHeart as LikeButton} from 'react-icons/fa';
/**
 * Top Level Component for castplayer demo
 * - note additional buttons right/left for player controls
 * - note route required for cast receiver
 * - see public/index.html for src tags to include google cast libraries
 */

export default class App extends Component {
	render() {
		let extraButtons = { 
			left:[{label:<LikeButton size='33' />,onClick:function() {console.log('FAV CLICK')}}],
			right:[{label:<ListButton size='33' />,onClick:function() {console.log('PLAYLIST CLICK')}}]
		}
		return <Router>
				<Switch>
					<PropsRoute  path='/cast' component={CastReceiver}  />

					<PropsRoute path='/' component={CastPlayerController} chromecastReceiverApplicationId='089C49EE' playlist={samplePlaylist} currentTrack={0} extraButtons={extraButtons} />
				</Switch>
			</Router>
	}

}
					
				
